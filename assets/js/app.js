var tissueComponent = {
    props: ['data', 'index', 'cheapest'],
    computed: {
        subtotal: function() {
            var total = parseFloat(this.data.price) / (parseInt(this.data.sheet) * parseInt(this.data.package));
            return isNaN(total) ? '' : total.toFixed(5);
        }
    },
    watch: {
        subtotal: function () {
            this.data.subtotal = this.subtotal;
        },
        data: {
            handler: function () {
                this.$parent.save();
            },
            deep: true
        }
    }
};

Vue.component('tissue', $.extend({template: '#template-tissue'}, tissueComponent));
Vue.component('tissuePanel', $.extend({template: '#template-tissue-panel'}, tissueComponent));

var app = new Vue({
    el: '#app',
    data: {
        autoSave: true,
        count: 5,
        mockData: {
            name: '',
            sheet: '',
            package: '',
            price: '',
            subtotal: ''
        },
        data: []
    },
    methods: {
        save: function() {
            if (localStorage) {
                localStorage.setItem('data', JSON.stringify(this.data));
            }
        },
        addColumn: function() {
            for(i=0; i<this.count; i++) {
                this.data.push(Vue.util.extend({}, this.mockData));
            }
        },
        isCheapest: function (data) {
            return data.subtotal == this.cheapest;
        },
        hasStorageData: function() {
            return localStorage && localStorage.hasOwnProperty('data');
        }
    },
    computed: {
        cheapest: function () {
            var arr = $.map(this.data, function(data) {
                return data.subtotal;
            }).filter(Number);

            return Math.min.apply(null, arr);
        }
    },
    mounted: function () {

        try {

            if(this.hasStorageData()) {
                this.data = JSON.parse(localStorage.getItem('data'));
                return;
            }

        } catch(e) {
            //
        }

        this.addColumn();
    }
});

$(function () {
    $(".b-switch").bootstrapSwitch({
        size: 'small',
        onSwitchChange: function () {

        }
    });
});