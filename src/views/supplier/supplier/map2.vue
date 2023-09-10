<template>
    <div>
        <div class="map-box">
            <baidu-map class="bm-view" ak="nRoPMzUgXxSg1uAaHc6gUiwDAbyvWkoE" :zoom="mapZoom" :center="mapCenter" :scroll-wheel-zoom="true" @ready="handlerBMap">
                <bm-control >
                    <bm-auto-complete v-model="keywordValue" @confirm="confirm" :sugStyle="{zIndex: 999999}">
                        <input style="width: 100%;margin-bottom: 20px;" v-model="keywordValue" placeholder="请输入地名关键字"/> <!-- 这里指代一个自定义搜索框组件 -->
                    </bm-auto-complete>
                </bm-control>
            </baidu-map>

        </div>
    </div>
</template>

<script>
    import { BaiduMap, BmControl, BmAutoComplete } from 'vue-baidu-map';
    export default {
        name: 'mapLabel',
        props: {
            dz: {
                type: Object,
                default: () => {},
            },
        },
        components: { BaiduMap, BmControl, BmAutoComplete },
        data() {
            return {
                mapZoom: 15,
                keywordValue: '',
                mapCenter: { lng: 116.404, lat: 39.915 },
            };
        },
        methods: {
            handlerBMap({ BMap, map }) {
                let _this = this;
                this.BMap = BMap;
                this.map = map;
                this.mapCenter = { lng: 116.404, lat: 39.915 };
                console.log('this.dzthis.dzthis.dz', this.dz);
                if (this.dz && Object.keys(this.dz).length > 0) {
                    this.mapCenter = {
                        lat: this.dz.lat,
                        lng: this.dz.lng,
                    };
                    let local = new this.BMap.LocalSearch(this.map, {
                        onSearchComplete: function(res) {
                            console.log('resres', res);
                        },
                    });
                    _this.keywordValue = _this.dz.address;
                    console.log('myValue', _this.keywordValue);
                    local.search(_this.keywordValue);
                }
            },
            confirm(e) {
                console.log('eeee', e);
                let _this = this;
                let local = new this.BMap.LocalSearch(this.map, {
                    onSearchComplete: function(res) {
                        console.log('resres', res);
                        _this.map.clearOverlays();
                        var results = local.getResults().getPoi(0);
                        console.log('local.getResults()', results);
                        var pp = results.point; // 获取第一个智能搜索的结果
                        pp.addressInfo = results.address;
                        pp.address = results.keyword ? results.keyword : results.address;
                        console.log('pp', pp);
                        _this.$emit('callback', pp);
                        _this.map.centerAndZoom(pp, 18);
                        _this.map.addOverlay(new _this.BMap.Marker(pp)); // 添加标注
                    },
                });
                const _value = e.item.value;
                const myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
                this.keywordValue = myValue + ' ';
                console.log('myValue', myValue);
                local.search(myValue);
            },
        },
    };
</script>

<style lang="less">
.bm-view {
    width: 100%;
    height: 400px;
    .BMap_noprint {
        width: 100%;
    }
}
</style>
