/**
 * @license Highstock JS v8.0.2 (2020-03-03)
 *
 * Indicator series type for Highstock
 *
 * (c) 2010-2019 Sebastian Bochan
 *
 * License: www.highcharts.com/license
 */
'use strict';
(function (factory) {
    if (typeof module === 'object' && module.exports) {
        factory['default'] = factory;
        module.exports = factory;
    } else if (typeof define === 'function' && define.amd) {
        define('highcharts/indicators/ema', ['highcharts', 'highcharts/modules/stock'], function (Highcharts) {
            factory(Highcharts);
            factory.Highcharts = Highcharts;
            return factory;
        });
    } else {
        factory(typeof Highcharts !== 'undefined' ? Highcharts : undefined);
    }
}(function (Highcharts) {
    var _modules = Highcharts ? Highcharts._modules : {};
    function _registerModule(obj, path, args, fn) {
        if (!obj.hasOwnProperty(path)) {
            obj[path] = fn.apply(null, args);
        }
    }
    _registerModule(_modules, 'indicators/ema.src.js', [_modules['parts/Utilities.js']], function (U) {
        /* *
         *
         *  License: www.highcharts.com/license
         *
         *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
         *
         * */
        var correctFloat = U.correctFloat,
            isArray = U.isArray,
            seriesType = U.seriesType;
        /**
         * The EMA series type.
         *
         * @private
         * @class
         * @name Highcharts.seriesTypes.ema
         *
         * @augments Highcharts.Series
         */
        seriesType('ema', 'sma', 
        /**
         * Exponential moving average indicator (EMA). This series requires the
         * `linkedTo` option to be set.
         *
         * @sample stock/indicators/ema
         *         Exponential moving average indicator
         *
         * @extends      plotOptions.sma
         * @since        6.0.0
         * @product      highstock
         * @requires     stock/indicators/indicators
         * @requires     stock/indicators/ema
         * @optionparent plotOptions.ema
         */
        {
            params: {
                /**
                 * The point index which indicator calculations will base. For
                 * example using OHLC data, index=2 means the indicator will be
                 * calculated using Low values.
                 *
                 * By default index value used to be set to 0. Since Highstock 7
                 * by default index is set to 3 which means that the ema
                 * indicator will be calculated using Close values.
                 */
                index: 3,
                period: 9 // @merge 14 in v6.2
            }
        }, 
        /**
         * @lends Highcharts.Series#
         */
        {
            accumulatePeriodPoints: function (period, index, yVal) {
                var sum = 0,
                    i = 0,
                    y = 0;
                while (i < period) {
                    y = index < 0 ? yVal[i] : yVal[i][index];
                    sum = sum + y;
                    i++;
                }
                return sum;
            },
            calculateEma: function (xVal, yVal, i, EMApercent, calEMA, index, SMA) {
                var x = xVal[i - 1],
                    yValue = index < 0 ?
                        yVal[i - 1] :
                        yVal[i - 1][index],
                    y;
                y = typeof calEMA === 'undefined' ?
                    SMA : correctFloat((yValue * EMApercent) +
                    (calEMA * (1 - EMApercent)));
                return [x, y];
            },
            getValues: function (series, params) {
                var period = params.period,
                    xVal = series.xData,
                    yVal = series.yData,
                    yValLen = yVal ? yVal.length : 0,
                    EMApercent = 2 / (period + 1),
                    sum = 0,
                    EMA = [],
                    xData = [],
                    yData = [],
                    index = -1,
                    SMA = 0,
                    calEMA,
                    EMAPoint,
                    i;
                // Check period, if bigger than points length, skip
                if (yValLen < period) {
                    return;
                }
                // Switch index for OHLC / Candlestick / Arearange
                if (isArray(yVal[0])) {
                    index = params.index ? params.index : 0;
                }
                // Accumulate first N-points
                sum = this.accumulatePeriodPoints(period, index, yVal);
                // first point
                SMA = sum / period;
                // Calculate value one-by-one for each period in visible data
                for (i = period; i < yValLen + 1; i++) {
                    EMAPoint = this.calculateEma(xVal, yVal, i, EMApercent, calEMA, index, SMA);
                    EMA.push(EMAPoint);
                    xData.push(EMAPoint[0]);
                    yData.push(EMAPoint[1]);
                    calEMA = EMAPoint[1];
                }
                return {
                    values: EMA,
                    xData: xData,
                    yData: yData
                };
            }
        });
        /**
         * A `EMA` series. If the [type](#series.ema.type) option is not
         * specified, it is inherited from [chart.type](#chart.type).
         *
         * @extends   series,plotOptions.ema
         * @since     6.0.0
         * @product   highstock
         * @excluding dataParser, dataURL
         * @requires  stock/indicators/indicators
         * @requires  stock/indicators/ema
         * @apioption series.ema
         */
        ''; // adds doclet above to the transpiled file

    });
    _registerModule(_modules, 'masters/indicators/ema.src.js', [], function () {


    });
}));