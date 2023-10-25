<template>
  <table class="table-chart">
    <tbody>
      <tr>
        <td
          :colspan="
            datasource.children && datasource.children.length
              ? datasource.children.length * 2
              : null
          "
        >
          <div
            class="chartNode"
            :id="datasource.id"
            @click.stop="handleClick(datasource)"
          >
            <slot :node-data="datasource">
              <div class="chartTitle">
                <p style="margin-left: 0.5rem; margin-right: 0.5rem">
                  {{ datasource.name }}
                </p>
              </div>
              <div class="chartContent">
                <p style="margin-left: 0.5rem; margin-right: 0.5rem">
                  {{ datasource.title }}
                </p>
              </div>
            </slot>
          </div>
        </td>
      </tr>
      <template v-if="datasource.children && datasource.children.length">
        <tr class="chartLines">
          <td :colspan="datasource.children.length * 2">
            <div class="chartDownLine"></div>
          </td>
        </tr>
        <tr class="chartLines">
          <td class="chartRightLine"></td>
          <template v-for="n in datasource.children.length - 1" v-bind:key="n">
            <td class="chartLeftLine chartTopLine"></td>
            <td class="chartRightLine chartTopLine"></td>
          </template>
          <td class="chartLeftLine"></td>
        </tr>
        <tr class="nodes">
          <td colspan="2" v-for="child in datasource.children" :key="child.id">
            <OrganizationChartNode
              :datasource="child"
              :handle-click="handleClick"
            >
              <template
                v-for="slot in Object.keys($slots)"
                v-slot:[slot]="scope"
              >
                <slot :name="slot" v-bind="scope" />
              </template>
            </OrganizationChartNode>
          </td>
        </tr>
      </template>
    </tbody>
  </table>
</template>

<script>
export default {
  name: "OrganizationChartNode",
  props: {
    datasource: Object,
    handleClick: Function,
  },
  methods: {},
};
</script>

<style>
.table-chart {
  margin-bottom: 0.5rem;
  margin-left: auto;
  margin-right: auto;
  border-collapse: separate;
}

.chartNode {
  box-sizing: border-box;
  display: inline-flex;
  flex-direction: column;
  position: relative;
  margin: 0 1px 2px 1px;
  border: 1px solid #1a1a1a;
  min-width: 12rem;
  text-align: center;
  transition-property: color, background-color, border-color,
    text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter,
    backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}
.chartNode:hover {
  box-shadow: 0 0 5px #006699;
  cursor: default;
  z-index: 20;
}

.chartTitle {
  text-align: center;
  font-size: 0.75rem;
  font-weight: bold;
  line-height: 1.25rem;
  overflow: hidden;
  white-space: nowrap;
  background: #006699;
  color: white;
}

.chartContent {
  box-sizing: border-box;
  width: 100%;
  //height: 1.25rem;
  font-size: 0.75rem;
  line-height: 1rem;
  border: #f56868;
  text-align: center;
  background: white;
  color: black;
  overflow: hidden;
  white-space: nowrap;
}

.chartLines {
  height: 1.25rem;
}

.chartDownLine {
  background: #006699;
  margin-left: auto;
  margin-right: auto;
  height: 1.25rem;
  width: 0.125rem;
  float: none;
}

.chartTopLine {
  border-top-color: #006699;
  border-top-style: solid;
  border-top-width: 2px;
}

.chartRightLine {
  border-right-color: #006699;
  border-right-style: solid;
  border-right-width: 1px;
}

.chartLeftLine {
  border-left-color: #006699;
  border-left-style: solid;
  border-left-width: 1px;
}
</style>
