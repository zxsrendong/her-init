<%extends file="page/fe/common.tpl"%>

<%block name="cms_data" prepend%>

<%/block%>

<%block name="meta_ext"%>

<%/block%>

<%block name="ext_css"%>
	<%require name="${project}:resource/css/index.less"%>
<%/block%>

<%block name="title" prepend%>娱乐<%/block%>

<%block name="header"%>
    <%$headerData = []%>
    <%widget name="`$_HEADER_TPL_PATH`" headerData=$headerData%>
<%/block%>

<%block name="content"%>

<%/block%>

<%block name="adv"%><%/block%>

<%block name="footer"%><%strip%>
	<%$footerData = [
        modeClass => "w1235"
    ]%>
    <%widget name="`$_FOOTER_TPL_PATH`" footerData=$footerData%>
<%/strip%><%/block%>

<%block name="page_js" append%>
<script runat="server">
    require('${project}:resource/js/index.js');
</script>
<%/block%>