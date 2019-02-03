var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

/**
 * antd Table组件列移动高阶组件
 * author by zhouran@qq.com
 */

import { DragSource, DropTarget, DragDropContext } from 'react-dnd';
import HTML5 from 'react-dnd-html5-backend';

export default (options => WrappedComponent => {
	let dragDirection = (dragIndex, hoverIndex, initialClientOffset, clientOffset, sourceClientOffset) => {
		const hoverMiddleX = (initialClientOffset.x - sourceClientOffset.x) / 2;
		const hoverClientX = clientOffset.x - sourceClientOffset.x;
		if (dragIndex < hoverIndex && hoverClientX > hoverMiddleX) {
			return 'rightward';
		}
		if (dragIndex > hoverIndex && hoverClientX < hoverMiddleX) {
			return 'leftward';
		}
	};

	let BodyCell = props => {
		const {
			isOver,
			connectDragSource,
			connectDropTarget,
			moveCell,
			dragCell,
			clientOffset,
			sourceClientOffset,
			initialClientOffset
		} = props,
		      restProps = _objectWithoutProperties(props, ['isOver', 'connectDragSource', 'connectDropTarget', 'moveCell', 'dragCell', 'clientOffset', 'sourceClientOffset', 'initialClientOffset']);
		let style = {
			cursor: 'move'
		};

		let className = restProps.className;
		if (isOver && initialClientOffset) {
			const direction = dragDirection(dragCell.index, restProps.index, initialClientOffset, clientOffset, sourceClientOffset);
			if (direction === 'rightward') {
				style = _extends({}, style, {
					borderRight: 'solid 1px #e2231a'
				});
			}
			if (direction === 'leftward') {
				style = _extends({}, style, {
					borderLeft: 'solid 1px #e2231a'
				});
			}
		}

		return connectDragSource(connectDropTarget(React.createElement('th', _extends({}, restProps, {
			className: className,
			style: style
		}))));
	};

	const rowSource = {
		beginDrag(props) {
			return {
				index: props.index
			};
		}
	};

	const rowTarget = {
		drop(props, monitor) {
			const dragIndex = monitor.getItem().index;
			const hoverIndex = props.index;
			if (dragIndex === hoverIndex) {
				return;
			}
			props.moveCell(dragIndex, hoverIndex);
			monitor.getItem().index = hoverIndex;
		}
	};

	BodyCell = DropTarget('row', rowTarget, (connect, monitor) => ({
		connectDropTarget: connect.dropTarget(),
		isOver: monitor.isOver(),
		sourceClientOffset: monitor.getSourceClientOffset()
	}))(DragSource('row', rowSource, (connect, monitor) => ({
		connectDragSource: connect.dragSource(),
		dragCell: monitor.getItem(),
		clientOffset: monitor.getClientOffset(),
		initialClientOffset: monitor.getInitialClientOffset()
	}))(BodyCell));

	return DragDropContext(HTML5)(class MoveColumnCol extends React.PureComponent {
		constructor(props) {
			super(props);
			this.state = {
				columns: []
			};
			this.moveCell = this.moveCell.bind(this);
			this.setInitColumns = this.setInitColumns.bind(this);
		}

		componentDidMount() {
			if (options.listName) {
				let storage = localStorage[options.listName];
				if (storage) {
					let storageColumns = storage.split(",");
					if (storageColumns.length != options.columns.length) {
						this.setInitColumns();
						localStorage[options.listName] = options.columns.map(el => {
							return el.dataIndex;
						}).join(",");
					} else {
						let allColumns = {};
						for (let el of options.columns) {
							allColumns[el.dataIndex] = el;
						}
						this.setState({
							columns: storageColumns.map(el => {
								return allColumns[el];
							})
						});
					}
				} else {
					this.setInitColumns();
				}
			} else {
				this.setInitColumns();
			}
		}

		setInitColumns() {
			this.setState({
				columns: options.columns
			});
		}

		moveCell(oldIndex, newIndex) {
			let showColumns = this.state.columns.map(el => {
				return el;
			});
			if (oldIndex > newIndex) {
				//左移动
				showColumns.splice(newIndex, 0, showColumns[oldIndex]);
				showColumns.splice(oldIndex + 1, 1);
			} else {
				showColumns.splice(newIndex + 1, 0, showColumns[oldIndex]);
				showColumns.splice(oldIndex, 1);
			}
			this.setState({
				columns: showColumns
			});
			if (options.listName) {
				localStorage[options.listName] = showColumns.map(el => {
					return el.dataIndex;
				}).join(",");
			}
		}

		render() {
			const newProps = {
				moveColumn: {
					columns: this.state.columns,
					tableFieldDecorator: tableOptions => TableComponent => {
						return React.cloneElement(TableComponent, _extends({}, this.props, {
							components: {
								header: {
									cell: BodyCell
								}
							},
							columns: this.state.columns.map((el, i) => {
								let result = _extends({}, el, {
									onHeaderCell: column => {
										return {
											index: i,
											moveCell: this.moveCell
										};
									}
								});
								if (tableOptions.render && tableOptions.render[el.dataIndex]) {
									result['render'] = tableOptions.render[el.dataIndex];
								}
								return result;
							})
						}));
					}
				}
			};
			return React.createElement(WrappedComponent, _extends({}, this.props, newProps));
		}
	});
});