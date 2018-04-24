<template>
  <div class="tableContent w-table" :class="{'w-table_moving': dragState.dragging}">
    <el-table
      ref="multipleTable"
      :data="tableDate.tableData"
      border
      :cell-class-name="cellClassName"
      :header-cell-class-name="headerCellClassName"
      @header-contextmenu="header_contextmenu"
      @cell-dblclick="cell_dblclick"
      style="width: 100%">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <template v-for="(tableColumn,index) in tableDate.tableColumns" v-if='tableColumn.show'>
        <el-table-column
          :key="index"
          :sortable="tableColumn.sortable"
          :prop="tableColumn.prop"
          :label="tableColumn.label"
          :column-key="index.toString()"
          :render-header="renderHeader"
          :width="tableColumn.width">
          <template slot-scope="scope">
            <el-input v-show="scope.row.isShowInput[tableColumn.prop]"
                      @blur="cell_inner_input_blur($event,scope.row,tableColumn.prop)"
                      className="cell_inner_input"
                      v-model="scope.row[tableColumn.prop]"></el-input>
            <div class="cell" v-show="!scope.row.isShowInput[tableColumn.prop]">{{scope.row[tableColumn.prop]}}</div>
          </template>
        </el-table-column>
      </template>
    </el-table>
    <div class="chooseLineInfo" v-show="isShowContextMenu"
         :style="{top:ContextMenuStyle.top,left:ContextMenuStyle.left}" ref="chooseLineInfo">
      <el-dropdown trigger="click" split-button size="mini" type="info">
        列
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="tableColumn,index in tableDate.tableColumns" :key="index">
            <el-checkbox v-model="tableColumn.show" text-color="#ccc" :label="tableColumn.label">{{tableColumn.label}}
            </el-checkbox>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <div class="moveCircle" :style="{top:moveCircle.top,left:moveCircle.left,display:moveCircle.show?'block':'none'}">
      {{moveCircle.text}}
    </div>
  </div>
</template>

<script>
  import Input from './input'

  export default {
    data() {
      return {
        tableDate: {
          tableColumns: [
            {
              prop: "date",
              label: "日期",
              width: "150",
              sortable: true,
              show: true
            },
            {
              prop: "name",
              label: "姓名",
              width: "120",
              sortable: true,
              show: true
            },
            {
              prop: "province",
              label: "省份",
              width: "120",
              sortable: false,
              show: true
            },
            {
              prop: "city",
              label: "市区",
              width: "120",
              sortable: true,
              show: false
            },
            {
              prop: "address",
              label: "地址",
              width: "300",
              sortable: true,
              show: true
            },
            {
              prop: "zip",
              label: "邮编",
              width: "120",
              sortable: true,
              show: false
            },
          ],
          tableData: [
            {
              date: '2016-05-03',
              name: 'z小虎',
              province: '上海',
              city: '普陀区',
              address: '上海市普陀区金沙江路 1518 弄',
              zip: 200333,
              isShowInput: {}
            },
            {
              date: '2016-05-02',
              name: '张小虎',
              province: '上海',
              city: '普陀区',
              address: '上海市普陀区金沙江路 1518 弄',
              zip: 200333,
              isShowInput: {}
            },
            {
              date: '2016-05-04',
              name: '王小虎',
              province: '上海',
              city: '普陀区',
              address: '上海市普陀区金沙江路 1518 弄',
              zip: 200333,
              isShowInput: {}
            },
            {
              date: '2016-05-01',
              name: '安小虎',
              province: '上海',
              city: '普陀区',
              address: '上海市普陀区金沙江路 1518 弄',
              zip: 200333,
              isShowInput: {}
            }
          ],
        },
        multipleSelection: [],
        isShowContextMenu: false,
        ContextMenuStyle: {
          top: 0,
          left: 0,
        },
        dragState: {
          start: null,
          end: null,
          dragging: false,
          direction: undefined
        },
        moveCircle: {
          text: '',
          show: false,
          top: 0,
          left: 0
        }
      }
    },

    methods: {
      /**
       * 自定义表头渲染函数
       **/
      renderHeader(createElement, {column}) {
        return createElement(
          'div', {
            'class': ['thead-cell'],
            on: {
              mousedown: ($event) => {
                this.handleMouseDown($event, column)
              },
              mousemove: ($event) => {
                this.handleMouseMove($event, column)
              }
            }
          }, [
            // 添加 <a> 用于显示表头 label
            createElement('a', column.label),
          ])
      },

      /**
       * 双击出现输入框
       **/
      cell_dblclick: function (...arg) {
        let [row, column, cell, event] = arg;
        event.preventDefault();
        this.$set(row.isShowInput, column.property, true);

        /**
         * 输入框出现获取焦点
         **/
        if (event.target.getElementsByClassName('cell').length > 0) {
          let focus = event.target.getElementsByClassName('cell')[0].getElementsByClassName('el-input')[0].getElementsByTagName('input')[0];
          setTimeout(() => {
            focus.focus()
          }, 0);
        }
        else if (event.target.getElementsByClassName('cell').length === 0) {
          let focus = event.target.parentNode.getElementsByClassName('el-input')[0].getElementsByTagName('input')[0];
          setTimeout(() => {
            focus.focus()
          }, 0);
        }
      },

      /**
       * 焦点丢失输入框隐藏
       **/
      cell_inner_input_blur: function (...arg) {
        let [e, show, prop] = arg;
        this.$set(show.isShowInput, prop, false);
      },

      /**
       * 右键单击表头出现列选择框
       **/
      header_contextmenu: function (...arg) {
        let [column, e] = arg;
        let clickRemoveMenu = false;
        e.preventDefault();
        this.isShowContextMenu = true;
        this.ContextMenuStyle.top = e.clientY + 'px';
        this.ContextMenuStyle.left = e.clientX + 'px';

        this.$refs.chooseLineInfo.addEventListener('mouseenter', (e) => {
          this.$refs.chooseLineInfo.clickRemoveMenu = true;
        }, false);
        this.$refs.chooseLineInfo.addEventListener('mouseleave', (e) => {
          this.$refs.chooseLineInfo.clickRemoveMenu = false;
        }, false);
        window.addEventListener('click', this.hide_header_contextmenu, false);
      },

      /**
       * 单击列选择框以外的区域隐藏列选择框
       **/
      hide_header_contextmenu: function (e) {
        if (!this.$refs.chooseLineInfo.clickRemoveMenu) {
          this.isShowContextMenu = false
          window.removeEventListener('click', this.hide_header_contextmenu, false)
        }

      },

      /**
       * 鼠标按下
       **/
      handleMouseDown(e, column) {
        if (e.which === 1 && e.target.nodeName !== 'TH') {
          this.dragState.dragging = true;
          this.dragState.start = parseInt(column.columnKey);
          //写入拖动框信息
          this.moveCircle.text = column.label;
          // 给拖动时的虚拟容器添加宽高
          let table = document.getElementsByClassName('w-table')[0];
          let virtual = document.getElementsByClassName('virtual');
          for (let item of virtual) {
            item.style.height = table.clientHeight - 1 + 'px';
            item.style.width = item.parentElement.parentElement.clientWidth + 'px'
          }
          document.addEventListener('mouseup', this.handleMouseUp);
        }
      },

      /**
       * 鼠标放开结束拖动
       **/
      handleMouseUp() {
        if (this.dragState.dragging) {
          this.dragColumn(this.dragState);
          //初始化移动框信息
          this.moveCircle = {
            text: '',
            show: false,
            top: 0,
            left: 0
          };
          // 初始化拖动状态
          this.dragState = {
            start: null,
            end: null,
            dragging: false,
            direction: undefined
          };
          document.removeEventListener('mouseup', this.handleMouseUp);
        }
      },

      /**
       * 拖动中
       **/
      handleMouseMove(e, column) {
        if (this.dragState.dragging) {
          let index = parseInt(column.columnKey);// 记录起始列
          if (index - this.dragState.start !== 0) {
            this.dragState.direction = index - this.dragState.start < 0 ? 'left' : 'right';// 判断拖动方向
            this.dragState.end = parseInt(column.columnKey) + 1;
          } else {
            this.dragState.direction = undefined
          }
        } else {
          return false
        }
      },

      /**
       * 拖动易位
       **/
      dragColumn({start, end}) {
        if (typeof(start) === 'object' || typeof(end) === 'object') {
          return
        }
        end = end - 1;
        if (start === end) {
          return
        }

        let transcript = JSON.parse(JSON.stringify(this.tableDate.tableColumns));
        let begin = this.tableDate.tableColumns.slice(start, start + 1);
        transcript.splice(start, 1);
        transcript.splice(end, 0, begin[0]);
        this.$set(this.tableDate, 'tableColumns', transcript);
        this.dragState.start = this.dragState.end;
        setTimeout(() => {
          this.$refs.multipleTable.data = JSON.parse(JSON.stringify(this.$refs.multipleTable.data))
        }, 10)
      },

      /**
       * 设置class名
       **/
      headerCellClassName(args) {
        let {column} = args;
        let columnKey = parseInt(column.columnKey) + 1;
        let active = columnKey === this.dragState.end ? `darg_active_${this.dragState.direction}` : '';
        let start = columnKey === this.dragState.start ? `darg_start` : '';
        return `${active} ${start}`
      },

      cellClassName({column, columnIndex}) {
        return (columnIndex - 1 === this.dragState.start ? `darg_start` : '')
      }
    },

    computed: {},

    mounted() {
      window.addEventListener('mousemove', (e) => {
        let {direction,dragging} = this.dragState
        if (direction && dragging) {
          this.moveCircle.show = true;
          this.moveCircle.top = e.clientY +20 + 'px';
          this.moveCircle.left = e.clientX +20 + 'px';
        }
      }, false)
    },

    component: {
      Input,
    },
  }
</script>
<style>
  .tableContent {
    position: relative;
  }

  .w-table .cell_inner_input {
    width: 100%;
    text-align: center;
  }

  .w-table .chooseLineInfo {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
  }

  .w-table .thead-cell {
    vertical-align: middle;
  }

  .w-table .caret-wrapper {
    vertical-align: middle;
  }

  .w-table th {
    padding: 0;
  }

  .w-table th.darg_active_left {
    border-left: 2px dashed #ccc;
  }

  .w-table th.darg_active_right {
    border-right: 2px dashed #ccc;
  }

  .moveCircle {
    position: fixed;
    height: 23px;
    line-height: 23px;
    width: 100px;
    background: #ddd;
    opacity: 0.6;
    font-size: 14px;
    padding: 0 10px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    border: 1px solid #ebeef5;
  }
</style>
