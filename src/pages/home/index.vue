<template>
  <div class="container">
    <Navbar></Navbar>
    <div class="homeContainer">
      <SearchBar></SearchBar>
      <div class="blockInfo">
        <div class="blockInfoItem">
          <p class="val">{{homeInfo.maxNum/Math.pow(10,6)}}</p>
          <p class="name">{{$t('lang28')}}</p>
        </div>
        <div class="blockInfoItem">
          <p class="val">{{homeInfo.useNum/Math.pow(10,6)}}</p>
          <p class="name">{{$t('lang29')}}</p>
        </div>
        <div class="blockInfoItem">
          <p class="val">{{homeInfo.waitNum/Math.pow(10,6)}}</p>
          <p class="name">{{$t('lang30')}}</p>
        </div>
        <div class="blockInfoItem">
          <p class="val">{{homeInfo.yestodayNum/Math.pow(10,6)}}</p>
          <p class="name">{{$t('lang31')}}</p>
        </div>
        <div class="blockInfoItem">
          <p class="val">{{homeInfo.accountNum}}</p>
          <p class="name">{{$t('lang32')}}</p>
        </div>
        <div class="blockInfoItem">
          <p class="val">{{homeInfo.yestodayTransNum/Math.pow(10,6)}}</p>
          <p class="name">{{$t('lang33')}}</p>
        </div>
        <div class="blockInfoItem">
          <p class="val">{{homeInfo.superPeer}}</p>
          <p class="name">{{$t('lang34')}}</p>
        </div>
      </div>
      <div class="blockDetail clearfix">
        <div class="detailWrap fl hei241">
          <div class="detailTitle">
            <h2>{{$t('lang35')}}</h2>
            <p class="checkMore" @click="checkAllBlock">{{$t('lang36')}}<i></i></p>
          </div>
          <div class="detailCon">
            <ul class="translist">
              <li v-for="(item,index) in blockList" v-show="index<8" :key="index">
                <p>{{item.blockNumber}}<span class="time">{{item.timestamp}}</span></p>
                <p>{{item.transactionNumber?item.transactionNumber:0}} {{$t('lang3')}}</p>
                <p>{{item.dotcAmount?item.dotcAmount/Math.pow(10,6):0}}  DOTC</p>
              </li>
            </ul>
          </div>
        </div>
        <div class="detailWrap fr hei241">
          <div class="detailTitle">
            <h2>{{$t('lang37')}}</h2>
            <p class="checkMore" @click="checkAllTrans">{{$t('lang38')}}<i></i></p>
          </div>
          <div class="detailCon">
            <ul class="transblock">
              <li v-for="(item,index) in transList" v-show="index<4" :key="index">
                <div class="top">
                  <span class="hash">{{item.hash}}</span>
                  <span class="num">{{item.dotcAmount/Math.pow(10,6)}}  DOTC</span>
                </div>
                <div class="btm clearfix">
                  <p class="transdt">{{$t('lang39')}}<span>{{item.from}}</span></p>
                  <p class="transdt">{{$t('lang40')}}<span>{{item.to}}</span></p>
                  <span class="times">{{item.timestamp}}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="detailWrap fl hei270">
          <div class="detailTitle">
            <h2>{{$t('lang41')}} <span></span>(dotc)</h2>
          </div>
          <div class="detailCon nolrpad">
            <canvas class="container" id="container" height='270px' width="100%"></canvas>
          </div>
        </div>
        <div class="detailWrap fr hei270">
          <div class="detailTitle">
            <h2>{{$t('lang42')}}</h2>
          </div>
          <div class="detailCon nolrpad">
            <canvas class="container" id="container1" height='270px' width="100%"></canvas>
          </div>
        </div>
      </div>
    </div>
    <Btm></Btm>
  </div>
</template>

<script>
import Navbar from '../../components/Navbar'
import SearchBar from '../../components/SearchBar'
import Btm from '../../components/Btm'
const F2 = require('@antv/f2/lib/index')
import {getChainInfo,getSnapshot,getBlockList,getTransList,blockGetByAllHash} from '../../api/user'
import {formartTimeStamp,plusXing} from '../../config/utils'
export default {
  components:{
    Navbar,
    SearchBar,
    Btm
  },
  watch: {
    
  },
  data() {
    return {
      homeInfo:{},
      chartData:[],
      pageNum:0,
      pageNum1:0,
      blockList:[],
      transList:[],
      over:null
    }
  },
  mounted() {
    this.getHomeInfo()
    this.getChartData()
    this.queryBlockList()
    this.queryTransList()
    this.websocket()
  },
  beforeDestroy () {
    this.over()
  },
  methods: {
    checkAllBlock(){
      this.$router.push('/BlockHistory')
    },
    checkAllTrans(){
      this.$router.push('/TransferHistory')
    },
    createCharts(){
      const chart = new F2.Chart({
        id: 'container',
        pixelRatio: window.devicePixelRatio
      });
      chart.source(this.chartData, {
        value: {
          tickCount: 5,
          min: 0
        },
        date: {
          type: 'timeCat',
          range: [ 0, 1 ],
          tickCount: 3
        }
      });
      chart.tooltip({
        custom: true,
        showXTip: true,
        showYTip: true,
        snap: true,
        crosshairsType: 'xy',
        crosshairsStyle: {
          lineDash: [ 2 ]
        }
      });
      chart.axis('snapshotDate', {
        label: function label(text, index, total) {
          const textCfg = {};
          if (index === 0) {
            textCfg.textAlign = 'left';
          } else if (index === total - 1) {
            textCfg.textAlign = 'right';
          }
          return textCfg;
        }
      });
      chart.axis('transactionNum', {
        grid: {
          lineDash: null,
          stroke: '#1C1C1C',
          lineWidth: 1
        }
      });
      chart.line().position('snapshotDate*transactionNum').color('#25C83B');
      chart.render();
    },
    createCharts1(){
      const chart = new F2.Chart({
        id: 'container1',
        pixelRatio: window.devicePixelRatio
      });
      chart.source(this.chartData, {
        value: {
          tickCount: 5,
          min: 0
        },
        date: {
          type: 'timeCat',
          range: [ 0, 1 ],
          tickCount: 3
        }
      });
      chart.tooltip({
        custom: true,
        showXTip: true,
        showYTip: true,
        snap: true,
        crosshairsType: 'xy',
        crosshairsStyle: {
          lineDash: [ 2 ]
        }
      });
      chart.axis('snapshotDate', {
        label: function label(text, index, total) {
          const textCfg = {};
          if (index === 0) {
            textCfg.textAlign = 'left';
          } else if (index === total - 1) {
            textCfg.textAlign = 'right';
          }
          return textCfg;
        }
      });
      chart.axis('accountIncreaseNum', {
        grid: {
          lineDash: null,
          stroke: '#1C1C1C',
          lineWidth: 1
        }
      });
      chart.line().position('snapshotDate*accountIncreaseNum').color('#25C83B');
      chart.render();
    },
    getHomeInfo(){
      let that = this
      getChainInfo().then((res)=>{
        if(res.data.statusCode==200){
          that.homeInfo = res.data.data
        }
      })
    },
    getChartData(){
      let that = this
      getSnapshot().then((res)=>{
        if(res.data.statusCode==200){
          res.data.data.forEach((item,index) =>{
            item.transactionNum = item.transactionNum/Math.pow(10,6)
            item.snapshotDate = item.snapshotDate.substring(5,item.snapshotDate.length)
          })
          that.chartData = res.data.data
          that.createCharts()
          that.createCharts1()
        }
      })
    },
    queryBlockList(){
      let that = this
      getBlockList({pageNum:this.pageNum}).then(res=>{
        if(res.data.statusCode==200){
          res.data.data.forEach(item=>{
            item.timestamp  = formartTimeStamp(item.timestamp/1000)
          })
          that.blockList = res.data.data
        }
      })
    },
    queryTransList(){
      let that = this
      getTransList({pageNum:this.pageNum1}).then(res=>{
        if(res.data.statusCode==200){
          res.data.data.forEach(item=>{
            item.hash = plusXing(item.hash,5,5)
            item.from = plusXing(item.from,5,5)
            item.to = plusXing(item.to,5,5)
            item.timestamp  = formartTimeStamp(item.timestamp/1000)
          })
          that.transList = res.data.data
        }
      })
    },
    websocket () {
      let that = this
      let ws = new WebSocket('ws://47.57.4.24:8011/webSocket/10')
      ws.onopen = () => {
      // Web Socket 已连接上，使用 send() 方法发送数据
          // ws.send()
          console.log('数据发送中...')
      }
      ws.onmessage = evt => {
        if(evt.data!=='连接成功'){
          let data = JSON.parse(evt.data)
          that.homeInfo = data.chainInfo.data
          data.blocks.data.forEach(item=>{
            item.timestamp  = formartTimeStamp(item.timestamp/1000)
          })
          that.blockList = data.blocks.data
          data.transactions.data.forEach(item=>{
            item.hash = plusXing(item.hash,5,5)
            item.from = plusXing(item.from,5,5)
            item.to = plusXing(item.to,5,5)
            item.timestamp  = formartTimeStamp(item.timestamp/1000)
          })
          that.transList = data.transactions.data
        }
      }
      ws.onclose = function () {
      // 关闭 websocket
      console.log('连接已关闭...')
      }
      // 组件销毁时调用，中断websocket链接
      this.over = () => {
        ws.close()
      }
    }
  }
}
</script>
<style  lang="less" scoped>
.homeContainer{
  
  .blockInfo{
    width:100%;
    overflow:hidden;
    background:#1C1C1C;
    border-radius: 10px;
    box-shadow: 0px 2px 2px 0px rgba(46, 49, 56, 0.7);
    min-height:100px;
    margin-top:30px;
    margin-bottom:30px;
    .blockInfoItem{
      float:left;
      width:14%;
      text-align:center;
      .val{
        font-size:18px;
        color:#25C83B;
        padding-bottom:3px;
        padding-top:32px;
      }
      .name{
        font-size:12px;
        color:#585858;
        line-height:100%;
      }
    }
  }
  .blockDetail{
    .detailWrap{
      width: 49%;
      background:#1C1C1C;
      border-radius:10px;
      margin-bottom:30px;
      &.fl{float:left;}
      &.fr{float:right;}
      &.hei241{height:291px;}
      &.hei270{height:320px;padding-bottom:15px;}
      .detailTitle{
        height:50px;
        overflow:hidden;
        padding:0 20px;
        h2{
          float:left;
          font-size:16px;
          color:#fff;
          line-height:50px;
          span{
            font-size:12px;
            color:#585858;
          }
        }
        .checkMore{
          float:right;
          font-size:12px;
          color:#B7B7B7;
          line-height:50px;
          cursor: pointer;
          i{
            display:inline-block;
            vertical-align: middle;
            width:32px;
            height:32px;
            background:url(../../assets/img/caret.png) no-repeat center;
            background-size:100% 100%;
          }
        }
      }
      .detailCon{
        padding:10px 20px;
        &.nolrpad{
          padding:0
        }
        .transblock{
          li{
            margin-bottom:10px;
          }
        }
        .translist{
          li{
            overflow:hidden;
            margin-bottom:10px;
            p{
              float:left;
              font-size:14px;
              color:#fff;
              line-height:18px;
              width:33%;
              .time{color:#585858;padding-left:12px;font-size:12px;white-space: nowrap;}
              &:nth-child(2){text-align:center;}
              &:last-child{text-align:right;}
            }
          }
        }
        .transblock{
          li{
            .top{
              padding-bottom:7px;
              overflow: hidden;
              .hash{font-size:14px;color:#25C83B;line-height:14px;float:left;}
              .num{font-size:14px;color:#fff;line-height:18px;float:right;}
            }
            .btm{
              .transdt{
                float:left;
                margin-right:30px;
                font-size:12px;
                color:#B7B7B7;
                line-height:14px;
                span{
                  padding-left:10px;
                  font-size:12px;
                  color:#25C83B;
                  line-height:14px;
                }
              }
              .times{
                font-size:12px;
                color:#585858;
                line-height:12px;
                float:right;
              }
            }
          }
        }
        .container{
          height:270px;
          padding-top:0 !important;
        }
      }
    }
  }
}
@media screen and (max-width: 750px) {
  .homeContainer .blockDetail .detailWrap .detailCon .transblock li .btm .transdt{margin-right: 5px;}
  .homeContainer{
    .blockInfo{
      padding-bottom:15px;
      .blockInfoItem{
        width:30%;
      }
    }
    .blockDetail{
      .detailWrap{
        width:100%;
        &.hei241{
          height:345px;
          &:first-child{
            height:508px;
          }
        }
        .detailCon{
          .translist{
            li{
              overflow:hidden;
              margin-bottom:15px;
              p{
                white-space: nowrap;
                overflow:hidden;
                &:nth-child(1){width:100%;span{float:right;padding-bottom:5px;}}
                &:nth-child(2){float:left;text-align:left;}
                &:nth-child(3){float:right;}
              }
            }
          }
        }
      }
    }
  }
    
}
</style>
