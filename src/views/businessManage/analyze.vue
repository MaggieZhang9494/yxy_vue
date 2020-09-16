
<template>
    <div class="bg-f7f7f7">
        <v-content-head :headTitle="'message.menuName.analyze'" :headTitlePath="{path:'/analyze'}" :icon="true"></v-content-head>
        <div class="module-wrapper">
            <v-developing> </v-developing>
        </div>
    </div>
</template>
<script>
import contentHead from "@/components/contentHead";
import developing from "@/components/developing";
import {  } from "@/util/api";
import router from "@/router";
import errcode from "@/util/errcode";

export default {
    name: "analyze",
    components: {
        "v-content-head":contentHead,
        "v-developing":developing,
    },
    data: function() {
        return {

        };
    },
    mounted: function() {
    },
    methods: {

    }
};
</script>
<style scoped>

</style>

