<template>
    <div>
    <ProjectUI />
    <ProjectTable />
    <ProjectChart />
    </div>
</template>
<script>
import ProjectUI from "./ProjectUI.vue"
import ProjectTable from "./ProjectTable.vue"
import ProjectChart from "./ProjectChart.vue"

export default {
    components:{
        ProjectUI,
        ProjectTable,
        ProjectChart
    }
}
</script>
<style scoped>
    div{
        height: 100%;
        background-color:  rgba(0, 0, 0, 0.05);
    }
</style>