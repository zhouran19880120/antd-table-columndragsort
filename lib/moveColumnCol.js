'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDnd = require('react-dnd');

var _reactDndHtml5Backend = require('react-dnd-html5-backend');

var _reactDndHtml5Backend2 = _interopRequireDefault(_reactDndHtml5Backend);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; } /**
                                                                                                                                                                                                                              * antd Table组件列拖动排序高阶组件
                                                                                                                                                                                                                              * author by admin@qudaodao.com
                                                                                                                                                                                                                              */

exports.default = function () {
	var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	return function (WrappedComponent) {
		var dragDirection = function dragDirection(dragIndex, hoverIndex, initialClientOffset, clientOffset, sourceClientOffset) {
			var hoverMiddleX = (initialClientOffset.x - sourceClientOffset.x) / 2;
			var hoverClientX = clientOffset.x - sourceClientOffset.x;
			if (dragIndex < hoverIndex && hoverClientX > hoverMiddleX) {
				return 'rightward';
			}
			if (dragIndex > hoverIndex && hoverClientX < hoverMiddleX) {
				return 'leftward';
			}
		};

		var BodyCell = function BodyCell(props) {
			var isOver = props.isOver,
			    connectDragSource = props.connectDragSource,
			    connectDropTarget = props.connectDropTarget,
			    moveCell = props.moveCell,
			    dragCell = props.dragCell,
			    clientOffset = props.clientOffset,
			    sourceClientOffset = props.sourceClientOffset,
			    initialClientOffset = props.initialClientOffset,
			    restProps = _objectWithoutProperties(props, ['isOver', 'connectDragSource', 'connectDropTarget', 'moveCell', 'dragCell', 'clientOffset', 'sourceClientOffset', 'initialClientOffset']);

			var style = {
				cursor: 'move'
			};

			var className = restProps.className;
			var defaultBorderStyle = 'solid 1px #1890ff';
			if (isOver && initialClientOffset) {
				var direction = dragDirection(dragCell.index, restProps.index, initialClientOffset, clientOffset, sourceClientOffset);
				if (direction === 'rightward') {
					style = _extends({}, style, {
						borderRight: options.borderStyle || defaultBorderStyle
					});
				}
				if (direction === 'leftward') {
					style = _extends({}, style, {
						borderLeft: options.borderStyle || defaultBorderStyle
					});
				}
			}

			return connectDragSource(connectDropTarget(_react2.default.createElement('th', _extends({}, restProps, {
				className: className,
				style: style
			}))));
		};

		var rowSource = {
			beginDrag: function beginDrag(props) {
				return {
					index: props.index
				};
			}
		};

		var rowTarget = {
			drop: function drop(props, monitor) {
				var dragIndex = monitor.getItem().index;
				var hoverIndex = props.index;
				if (dragIndex === hoverIndex) {
					return;
				}
				props.moveCell(dragIndex, hoverIndex);
				monitor.getItem().index = hoverIndex;
			}
		};

		BodyCell = (0, _reactDnd.DropTarget)('row', rowTarget, function (connect, monitor) {
			return {
				connectDropTarget: connect.dropTarget(),
				isOver: monitor.isOver(),
				sourceClientOffset: monitor.getSourceClientOffset()
			};
		})((0, _reactDnd.DragSource)('row', rowSource, function (connect, monitor) {
			return {
				connectDragSource: connect.dragSource(),
				dragCell: monitor.getItem(),
				clientOffset: monitor.getClientOffset(),
				initialClientOffset: monitor.getInitialClientOffset()
			};
		})(BodyCell));

		return (0, _reactDnd.DragDropContext)(_reactDndHtml5Backend2.default)(function (_React$PureComponent) {
			_inherits(MoveColumnCol, _React$PureComponent);

			function MoveColumnCol(props) {
				_classCallCheck(this, MoveColumnCol);

				var _this = _possibleConstructorReturn(this, (MoveColumnCol.__proto__ || Object.getPrototypeOf(MoveColumnCol)).call(this, props));

				_this.state = {
					columns: []
				};
				_this.moveCell = _this.moveCell.bind(_this);
				_this.setInitColumns = _this.setInitColumns.bind(_this);
				return _this;
			}

			_createClass(MoveColumnCol, [{
				key: 'componentDidMount',
				value: function componentDidMount() {
					if (options.listName && options.columns) {
						var storage = localStorage[options.listName];
						if (storage) {
							var storageColumns = storage.split(",");
							if (storageColumns.length != options.columns.length) {
								this.setInitColumns();
								localStorage[options.listName] = options.columns.map(function (el) {
									return el.dataIndex;
								}).join(",");
							} else {
								var allColumns = {};
								var _iteratorNormalCompletion = true;
								var _didIteratorError = false;
								var _iteratorError = undefined;

								try {
									for (var _iterator = options.columns[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
										var el = _step.value;

										allColumns[el.dataIndex] = el;
									}
								} catch (err) {
									_didIteratorError = true;
									_iteratorError = err;
								} finally {
									try {
										if (!_iteratorNormalCompletion && _iterator.return) {
											_iterator.return();
										}
									} finally {
										if (_didIteratorError) {
											throw _iteratorError;
										}
									}
								}

								this.setState({
									columns: storageColumns.map(function (el) {
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
			}, {
				key: 'setInitColumns',
				value: function setInitColumns() {
					if (options.columns) {
						this.setState({
							columns: options.columns
						});
					}
				}
			}, {
				key: 'moveCell',
				value: function moveCell(oldIndex, newIndex) {
					var showColumns = this.state.columns.map(function (el) {
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
						localStorage[options.listName] = showColumns.map(function (el) {
							return el.dataIndex;
						}).join(",");
					}
				}
			}, {
				key: 'render',
				value: function render() {
					var _this2 = this;

					var newProps = {
						moveColumn: {
							columns: this.state.columns,
							tableFieldDecorator: function tableFieldDecorator() {
								var tableOptions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
								return function (TableComponent) {
									return _react2.default.cloneElement(TableComponent, _extends({}, _this2.props, {
										components: {
											header: {
												cell: BodyCell
											}
										},
										columns: _this2.state.columns.map(function (el, i) {
											var result = _extends({}, el, {
												onHeaderCell: function onHeaderCell(column) {
													return {
														index: i,
														moveCell: _this2.moveCell
													};
												}
											});
											if (tableOptions && tableOptions.render && tableOptions.render[el.dataIndex]) {
												result['render'] = tableOptions.render[el.dataIndex];
											}
											return result;
										})
									}));
								};
							}
						}
					};
					return _react2.default.createElement(WrappedComponent, _extends({}, this.props, newProps));
				}
			}]);

			return MoveColumnCol;
		}(_react2.default.PureComponent));
	};
};