/**
 * @file 编译配置文件
 */

fis.config.merge({
    namespace: '${project}',
    autopack: true,
    deploy: {
        dev: [
            {
                receiver: 'http://10.100.83.71:8083/receiver.php',
                from: 'template/',
                subOnly: true,
                to: 'smarty/template/',
                exclude: /.*\.(?:DS_Store|svn|cvs|tar|gz|rar|psd|Thumbs|DZ)/
            },
            {
                receiver: 'http://10.100.83.71:8087/receiver.php',
                from: 'resource/',
                subOnly: true,
                to: 'resource/',
                exclude: /.*\.(?:DS_Store|svn|cvs|tar|gz|rar|psd|Thumbs|DZ)/
            }
        ],
        online: [
            {
                from: 'template/',
                subOnly: true,
                to: 'output/template/',
                exclude: /.*\.(?:DS_Store|svn|cvs|tar|gz|rar|psd|Thumbs|DZ)/
            },
            {
                from: 'resource/',
                subOnly: true,
                to: 'output/resource/',
                exclude: /.*\.(?:DS_Store|svn|cvs|tar|gz|rar|psd|Thumbs|DZ)/
            }
        ]
    },
    /* eslint-disable */
    settings: {
        smarty: {
            'left_delimiter': '<%',
            'right_delimiter': '%>'
        }
    }
    /* eslint-disable */
});
//开启图片合并功能
fis.config.set('modules.spriter', 'csssprites');
fis.config.set('roadmap.path', [{reg: '**.css',useSprite: true}]);
fis.config.set('settings.spriter.csssprites.margin', 35);

fis.config.set('roadmap.domain', 'http://s0.hao123img.com, http://s1.hao123img.com, http://s2.hao123img.com');
fis.config.get('roadmap').path = [
    {
        reg: /^\/page\/(.+\.(?:tpl|php))$/i,
        isMod: true,
        release: '/template/page/${namespace}/$1',
        extras: {
            isPage: true
        }
    },
    {
    	url : 'widget/${namespace}/$1',
        reg: /^\/widget\/(.*\.(tpl|inc))$/i,
        isMod: true,
        release: '/template/widget/${namespace}/$1'
    },
    {
        reg: /^\/widget\/(.*\.(?:js|css|less|png))$/i,
        isMod: true,
        release: '/resource/${namespace}/widget/$1'
    },
    {
        reg: /^\/resource\/(.*)$/i,
        isMod: true,
        release: '/resource/${namespace}/$1'
    },
    {
        reg: '${namespace}-map.json',
        release: '/template/config/${namespace}-map.json'
    },
    {
        reg : '${namespace}-hermap.json',
        release : '/template/config/${namespace}-hermap.json'
    },
    {
        reg : /^\/data\/(.*)$/i,
        release : '/template/data/${namespace}/$1'
    },
    {
        reg: /^.+$/,
        release: false
    }
];
