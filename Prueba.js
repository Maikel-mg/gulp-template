var cuadroGraficoBarrasView = Backbone.View.extend({
    initialize: function (options) {
        _.bindAll(this, 'onPlotHover');

        this.options = options || {};

        this.meses = [
            [0, "Enero"] ,
            [1, "Febrero"] ,
            [2, "Marzo"] ,
            [3, "Abril"] ,
            [4, "Mayo"] ,
            [5, "Junio"] ,
            [6, "Julio"] ,
            [7, "Agosto"] ,
            [8, "Septiembre"] ,
            [9, "Octubre"] ,
            [10, "Noviembre"] ,
            [11, "Diciembre"]
        ];
        this.meta = [
            {
                color: "#F00",
                lineWidth : 0.8,
                yaxis: {
                    from: 1500,
                    to : 1500
                }
            }
        ];
        this.datosSerieMetasMIN = [];
        this.datosSerieMetas = [];
        this.datosSerieMetasMAX = [];
        this.datosSerieValores = [];
        this._generarDatosMeses();
    },

    _render: function () {

        var dataset = [
            { id: 'toleran' , label: 'Tolerancia', data: [], color: 'rgba(203,75,75,0.15)' },
            { id: 'metasMin', data: this.datosSerieMetasMIN, lines: { show: true, lineWidth: 0, fill: 0.15 }, points: { show: false }, color: '#CB4B4B', hoverable: false, fillBetween: "metas" },
            { id: 'metas'   , label: 'Metas', data: this.datosSerieMetas, lines: { show: true } , points: { show: true },  color: '#CB4B4B' },
            { id: 'metasMax', data: this.datosSerieMetasMAX, lines: { show: true, lineWidth: 0, fill: 0.15 }, points: { show: false }, color: '#CB4B4B', hoverable: false, fillBetween: "metas" },
            { id: 'valores', label: 'Valores', data: this.datosSerieValores, lines: { show: true }, points: { show: true } }
        ];


        this.$grafico = $.plot(this.$el, dataset,
            {

            yaxis : {
                reserveSpace : true
            },
            xaxis: {
                axisLabelPadding: 5,
                ticks: this.meses
            },
            grid: {
                hoverable: true,
                borderWidth: 1

            },
            legend: {
                noColumns: 0,
                margin: 10
            }
        });

        this.$el.bind("plothover", this.onPlotHover);
        return this;
    },
    setData: function (metas, valores) {
        this.dataMetas = metas;
        this.dataValores = valores;

        var _this = this;
        _.each(this.dataMetas, function (valor) {
            _this.datosSerieMetasMIN[valor.mes - 1][1] = parseInt(valor.valor) / ((_this.options.tolerancia / 100) + 1);
            _this.datosSerieMetas[valor.mes - 1][1] = parseInt(valor.valor);
            _this.datosSerieMetasMAX[valor.mes - 1][1] = parseInt(valor.valor) * ((_this.options.tolerancia / 100) + 1);

        });
        _.each(this.dataValores, function (valor) {
            _this.datosSerieValores[valor.mes - 1][1] = parseInt(valor.valor);
        });
    },

    onPlotHover: function (event, pos, item) {
        $("#tooltip").remove();

        if (item) {
            if (item.datapoint) {
                this._show_tooltip(item.pageX, item.pageY, "<div style='text-align: center;'><b>" + this.meses[item.dataIndex][1] + "</b>:   " + item.datapoint[1] + " " + this.options.unidad + " </div>");

                var x = item.datapoint[0].toFixed(2),
				    y = item.datapoint[1].toFixed(2);

                var html = "<div class='panel' style='border-color: #444'>" +
                            "<div class='panel-heading' style='background-color:#444; color:white;border: 1px solid #444; padding: 5px; text-transform: uppercase; text-align:center;'>" + this.meses[item.dataIndex][1] + "</div>" +

                                    "<table class='table table-bordered table-condensed'>" +
                                        "<thead>" +
                                            "<tr style='background-color:#EEE'>" +
                                                "<th>META</th>" +
                                                "<th>VALOR</th>" +
                                            "</tr>" +
                                        "</thead>" +
                                        "<tbody>" +
                                            "<tr>" +
                                                "<td style='text-align: center;'>" + this.datosSerieMetas[item.dataIndex][1] + "</td>" +
                                                "<td style='text-align: center;'>" + this.datosSerieValores[item.dataIndex][1] + "</td>" +
                                            "</tr>" +
                                        "</tbody>" +
                                        "<tfoot>" +
                                            "<tr class='info'>" +
                                                "<td colspan='2' style='text-transform: uppercase; font-weight: bold; text-align: center;'>" + this.options.unidad + "</td>" +
                                            "</tr>" +
                                        "</tfoot>" +
                                    "</table>" +
                           "</div>";

                $("#tooltip").html(html)
                    .css({ top: item.pageY - 125, left: item.pageX - 100 })
                    .fadeIn(200);
                return;
            }
        } else {
            previousPoint = null;
        }
    },

    _generarDatosMeses : function(){
        this.datosSerieMetas = [];
        this.datosSerieValores = [];
        for (var i = 0; i < 12; i += 1) {
            this.datosSerieMetasMIN.push([i, null]);
            this.datosSerieMetas.push([i, null]);
            this.datosSerieMetasMAX.push([i, null]);
            this.datosSerieValores.push([i, null]);
        }
    },
    _show_tooltip: function(x, y, contents) {
        $("<div id='tooltip'></div>").css({
            position: "absolute",
            display: "none",
            opacity: 0.9
        }).appendTo("body");
    }

});
