/**
 * antd Table组件列拖动排序高阶组件
 * author by admin@qudaodao.com
 */

import React, {
	PureComponent
} from 'react'
import {
	DragSource,
	DropTarget,
	DragDropContext
} from 'react-dnd';
import HTML5 from 'react-dnd-html5-backend';

export default (options = {}) => WrappedComponent => {
	let dragDirection = (dragIndex, hoverIndex, initialClientOffset, clientOffset, sourceClientOffset) => {
		const hoverMiddleX = (initialClientOffset.x - sourceClientOffset.x) / 2;
		const hoverClientX = clientOffset.x - sourceClientOffset.x;
		if (dragIndex < hoverIndex && hoverClientX > hoverMiddleX) {
			return 'rightward';
		}
		if (dragIndex > hoverIndex && hoverClientX < hoverMiddleX) {
			return 'leftward';
		}
	}

	let BodyCell = (props) => {
		const {
			isOver,
			connectDragSource,
			connectDropTarget,
			moveCell,
			dragCell,
			clientOffset,
			sourceClientOffset,
			initialClientOffset,
			...restProps
		} = props;
		let style = {
			cursor: 'move'
		};

		let className = restProps.className;
		const defaultBorderStyle = 'solid 1px #1890ff';
		if (isOver && initialClientOffset) {
			const direction = dragDirection(dragCell.index, restProps.index, initialClientOffset, clientOffset, sourceClientOffset);
			if (direction === 'rightward') {
				style = {
					...style,
					borderRight: options.borderStyle || defaultBorderStyle
				}
			}
			if (direction === 'leftward') {
				style = {
					...style,
					borderLeft: options.borderStyle || defaultBorderStyle
				}
			}
		}

		return connectDragSource(
			connectDropTarget(
				<th
					{...restProps}
					className={className}
					style={style}
				/>
			)
		);
	};

	const rowSource = {
		beginDrag(props) {
			return {
				index: props.index
			};
		},
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
		},
	};

	BodyCell = DropTarget('row', rowTarget, (connect, monitor) => ({
		connectDropTarget: connect.dropTarget(),
		isOver: monitor.isOver(),
		sourceClientOffset: monitor.getSourceClientOffset(),
	}))(
		DragSource('row', rowSource, (connect, monitor) => ({
			connectDragSource: connect.dragSource(),
			dragCell: monitor.getItem(),
			clientOffset: monitor.getClientOffset(),
			initialClientOffset: monitor.getInitialClientOffset(),
		}))(BodyCell)
	);

	return DragDropContext(HTML5)(class MoveColumnCol extends React.PureComponent {
		constructor(props) {
			super(props);
			this.state = {
				columns: []
			}
			this.moveCell = this.moveCell.bind(this);
			this.setInitColumns = this.setInitColumns.bind(this);
		}

		componentDidMount() {
			if (options.listName && options.columns) {
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
						})
					}
				} else {
					this.setInitColumns();
				}
			} else {
				this.setInitColumns();
			}
		}

		setInitColumns() {
			if (options.columns){
				this.setState({
					columns: options.columns
				})
			}
		}

		moveCell(oldIndex, newIndex) {
			let showColumns = this.state.columns.map(el => {
				return el;
			})
			if (oldIndex > newIndex) { //左移动
				showColumns.splice(newIndex, 0, showColumns[oldIndex]);
				showColumns.splice(oldIndex + 1, 1);
			} else {
				showColumns.splice(newIndex + 1, 0, showColumns[oldIndex]);
				showColumns.splice(oldIndex, 1);
			}
			this.setState({
				columns: showColumns
			})
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
					tableFieldDecorator: (tableOptions = {}) => TableComponent => {
						return React.cloneElement(TableComponent, {
							...this.props,
							components: {
								header: {
									cell: BodyCell
								}
							},
							columns: this.state.columns.map((el, i) => {
								let result = {
									...el,
									onHeaderCell: column => {
										return {
											index: i,
											moveCell: this.moveCell
										}
									}
								}
								if (tableOptions && tableOptions.render && tableOptions.render[el.dataIndex]) {
									result['render'] = tableOptions.render[el.dataIndex]
								}
								return result;
							})
						})
					}
				}
			}
			return (<WrappedComponent {...this.props} {...newProps} />);
		}
	})
}