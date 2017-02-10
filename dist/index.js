/**
 * @file index.js
 * @desc 娱乐首页入口函数
 */

var $ = require('fe:widget/js/base/jquery.js');
var template = require('fe:widget/js/third/arttemplate/template-native.min.js');

template.helper('$output', function (obj) {
    var keys = ['img0', 'img0_m', 'img0_l', 'img1', 'img1_m', 'img1_l', 'img2', 'img2_m', 'img2_l'];
    for (var i = 0, len = keys.length; i < len; i++) {
        if (obj[keys[i]]) {
            return obj[keys[i]];
        }
    }
    return '';
});

$(document).on('mouseenter', 'div[data-hhok="feed-item"] li', function () {
    $(this).addClass('hover');
})
.on('mouseleave', 'div[data-hhok="feed-item"] li', function () {
    $(this).removeClass('hover');
});
/* eslint-disable */
var feedSource = ''
+ '<div class="feed clearfix" data-hhok="feed-item" monkey="amuse-index-feed">'
+    '<ul class="txt-list">'
+        '<%for (var i = 0; i < 4; i++ ) {%>'
+        '<li>'
+            '<h5><a href="<%= data[i].url%>&source=yule" title="<%= data[i].title%>"><%= data[i].title%></a></h5>'
+            '<%if (data[i].desc.length > 60) {%>'
+            '<p><%= data[i].desc.substring(0, 60)%>...<a href="<%= data[i].url%>&source=yule" target="_blank">[详情]</a></p>'
+            '<%} else {%>'
+            '<p><%= data[i].desc%></p>'
+            '<%}%>'
+        '</li>'
+        '<%}%>'
+    '</ul>'
+    '<div class="pic-list">'
+        '<%for (var j = 4; j < 6; j++) {%>'
+        '<a href="<%= data[j].url%>&source=yule" title="<%= data[j].title%>" <%if (j === 5) {%>style="margin-bottom:0;"<%}%>>'
+            '<img src="<%= $output(data[j])%>" alt="<%= data[j].title%>">'
+            '<span class="mask">'
+                '<em><%= data[j].title%></em>'
+            '</span>'
+        '</a>'
+        '<%}%>'
+    '</div>'
+ '</div>';

function reRangeArray(arr) {
    var tempArr = [];
    var keys = ['img0', 'img0_m', 'img0_l', 'img1', 'img1_m', 'img1_l', 'img2', 'img2_m', 'img2_l'];
    var flag = true;
    for (var i = 0; i < 6; i++) {
        flag = true;
        for (var j = 0, len = keys.length; j < len; j++) {
            if (arr[i][keys[j]]) {
                tempArr.push(arr[i]);
                flag = false
                break;
            }
        }
        if (flag) {
            tempArr.unshift(arr[i]);
        }
    }
    return tempArr;
}

/* eslint-disable */
function Feed($container) {
    this.url = 'http://www.hao123.com/yule/api';
    this.pn = 1;
    this.$container = $container;
    this.ajaxRuning = false;
    this.isFinish = false;

    this.runder = template.compile(feedSource);
}

Feed.prototype.flow = function () {
    var me = this;
    if (this.isFinish || this.ajaxRuning) {
        return false;
    }
    this.ajaxRuning = true;
    $.ajax({
        url: this.url,
        data: {pn: this.pn},
        dataType: 'jsonp'
    }).done(function (res) {
        me.pn += 1;
        var html = '';
        if ($.isArray(res) && res.length >= 12) {
            html += me.runder({data: reRangeArray(res.slice(0, 6))});
            html += me.runder({data: reRangeArray(res.slice(6))});
            me.$container.append(html);
        }
        else {
            me.isFinish = true;
        }
        me.ajaxRuning = false;
    }).fail(function (xhr) {
        alert('没有更多数据了！');
    });
};

var feed = new Feed($('#feedContainer'));
var widowHeight = $(window).height();
var $recAdv = $('#recAdv');

$(window).scroll(function () {
    if ($('#feedFlow').length > 0
        && $(document).height() - $(window).scrollTop() - widowHeight < 200
        && !feed.isFinish) {
        feed.flow();
    }

    if ($recAdv.offset().top - 50 < $(window).scrollTop()) {
        $recAdv.addClass('rec-fixed');
    }
    else {
        $recAdv.removeClass('rec-fixed');
    }
});
setTimeout(function () {
    $(window).scroll();
}, 10);
