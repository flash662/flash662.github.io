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
            if (localStorage && this.autoSave) {
                localStorage.setItem('data', JSON.stringify(this.data));
            }
        },
        clearStorage: function () {
            if(localStorage) {
                localStorage.removeItem('data');
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
        },
        loadData: function () {

            try {

                if(this.hasStorageData()) {
                    this.data = JSON.parse(localStorage.getItem('data'));
                } else {
                    this.addColumn();
                }

            } catch(e) {

                //
            }
        }
    },
    watch: {
        autoSave: function (value) {
            if(value) {
                this.save();
            } else {
                this.clearStorage();
            }
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

        var $this = this;
        $(".b-switch").bootstrapSwitch({
            size: 'mini',
            onSwitchChange: function () {
                var checked = $(this).prop('checked');
                $this.autoSave = checked;
                localStorage.setItem('autoSave', checked);
            }
        });
    },
    beforeMount: function () {

        this.loadData();

        try {

            if (localStorage.hasOwnProperty('autoSave')) {
                this.autoSave = JSON.parse(localStorage.getItem('autoSave'));
            }

        } catch (e) {
            //
        }


    }
});