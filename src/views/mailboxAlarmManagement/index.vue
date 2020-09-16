<template>
    <div>
        <v-content-head :headTitle="'告警配置'" :headSubTitle="'邮件告警配置'" @changGroup="changGroup"></v-content-head>
        <div>
            
        </div>
    </div>
</template>

<script>
import contentHead from "@/components/contentHead";
import Bus from "@/bus"
export default {
    name: 'MailboxAlarmManagement',

    components: {
        "v-content-head": contentHead,
    },

    props: {
    },

    data() {
        return {
        }
    },

    computed: {
    },

    watch: {
    },

    created() {
    },

    beforeDestroy: function () {
        Bus.$off("changeGroup")
    },
    mounted() {
        Bus.$on("changeGroup", data => {
            this.changGroup(data)
        })
    },

    methods: {
        changGroup() {

        }
    }
}
</script>

<style scoped>
</style>
