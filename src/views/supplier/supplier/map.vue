<template>
    <div>
        <div class="map-box">
            <baidu-map class="bm-view" ak="nRoPMzUgXxSg1uAaHc6gUiwDAbyvWkoE" :center="mapCenter" :scroll-wheel-zoom="true"
                       @ready="handlerBMap"></baidu-map>
            <div v-show="showResultFlag" class="search-result">
                <div v-for="(item, index) in searchResult" class="item" :key="index" @click="handleSelect(item)">
                    <a-icon type="search" :style="{ fontSize: '14px', color: '#9ca5b3' }" />
                    <div class="title">{{ item.title }}</div>
                    <div class="address">{{ item.address }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { BaiduMap } from 'vue-baidu-map';
    const defaultInfo = {
        lng: 116.404,
        lat: 39.915,
        addressStr: '',
        title: '',
        province: '', // 省
        city: '', // 市
        district: '', // 区
    };
    export default {
        name: 'mapLabel',
        props: ['mapObj', 'keyword'],
        data() {
            return {
                mapZoom: 15,
                keywordValue: '',
                mapCenter: { lng: 116.404, lat: 39.915 },
                mapLocation: {
                    index: 0,
                    address: '',
                    str: '',
                    city: '',
                    point: {
                        lng: 0,
                        lat: 0,
                    },
                },
                BMap: null,
                map: null,
                showResultFlag: false,
                searchResult: [],
                selectInfo: {},
            };
        },
        watch: {
            mapObj: {
                deep: true,
                handler(val) {
                    if (val) {
                    }
                },
            },
            keyword: {
                handler(val) {
                    this.keywordValue = val;
                    console.log('keywordto', val);
                    this.handleSearch(val);
                },
            },

        },
        components: { BaiduMap },
        created() {
        },
        methods: {
            handlerBMap({ BMap, map }) {
                this.BMap = BMap;
                this.map = map;
            },
            handleSearch(keyword) {
                let self = this;
                self.showResultFlag = true;
                console.log('111111111', defaultInfo);
                self.selectInfo = Object.assign({}, defaultInfo);
                let local = new this.BMap.LocalSearch(this.map, {
                    renderOptions: {
                        map: this.map,
                        keyword,
                        selectFirstResult: false,
                    },
                    onSearchComplete: function(res) {
                        console.log('resres', res);
                        if (res && res.Yr) {
                            self.searchResult = [...res.Yr];
                        }
                    },
                });
                local.search(this.keyword);
            },
            handleSelect(item) {
                let self = this;
                console.log('item', item);
                let title = item.title;
                let { lng, lat } = item.marker.point;
                console.log('lng,lat', lng, lat);
                let point = new this.BMap.Point(lng, lat);
                let geoc = new this.BMap.Geocoder();
                geoc.getLocation(point, function(res) {
                    console.log('res111', res);
                    let addString =
                        res.addressComponents.province + res.addressComponents.city + res.addressComponents.district + title;
                    console.log('addString', addString);
                    self.showResultFlag = false;
                    self.keyword = addString;
                    self.map.clearOverlays(); // 清除地图上所有覆盖物
                    self.map.addOverlay(new self.BMap.Marker({ lng, lat }));
                    self.mapCenter.lng = lng;
                    self.mapCenter.lat = lat;
                    self.mapZoom = 15;
                    self.selectInfo = {
                        lng,
                        lat,
                        addressStr: addString,
                        title: title,
                        province: res.addressComponents.province,
                        city: res.addressComponents.city,
                        district: res.addressComponents.district,
                    };
                });
            },
        },
    };
</script>

<style lang="less">
.bm-view {
    width: 100%;
    height: 300px;
    margin-top: 10px;
}

.map-box {
    position: relative;

    .search-result {
        background-color: #fff;
        position: absolute;
        width: 100%;
        min-height: 80px;
        z-index: 999;
        top: -10px;
        padding: 5px;
        border: 1px solid #9ca5b3;
        overflow-x: scroll;

        .item {
            display: flex;
            align-items: center;
            flex-wrap: nowrap;
            height: 30px;

            .title {
                font-size: 14px;
                font-weight: 500;
                color: #9ca5b3;
                margin-left: 8px;
                white-space: nowrap;
            }

            .address {
                font-size: 13px;
                font-weight: 400;
                color: #9ca5b3;
                margin-left: 8px;
                white-space: nowrap;
            }
        }
    }

}
</style>
