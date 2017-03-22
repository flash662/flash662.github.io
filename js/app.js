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
        }
    }
};

Vue.component('tissue', $.extend({template: '#template-tissue'}, tissueComponent));

Vue.component('tissuePanel', $.extend({template: '#template-tissue-panel'}, tissueComponent));

var app = new Vue({
    el: '#app',
    data: {
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
        addColumn: function() {
            for(i=0; i<this.count; i++) {
                this.data.push(Vue.util.extend({}, this.mockData));
            }
        },
        isCheapest: function (data) {
            return data.subtotal == this.cheapest;
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
        this.addColumn();
    }
});