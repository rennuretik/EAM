/**
 * 日期时间脚本库方法列表：
 * （1）Date.isValiDate：日期合法性验证
 * （2）Date.isValiTime：时间合法性验证
 * （3）Date.isValiDateTime：日期和时间合法性验证
 * （4）Date.prototype.isLeapYear：判断是否闰年
 * （5）Date.prototype.format：日期格式化
 * （6）Date.stringToDate：字符串转成日期类型
 * （7）Date.daysBetween：计算两个日期的天数差
 * （8）Date.prototype.dateAdd：日期计算，支持正负数
 * （9）Date.prototype.dateDiff：比较日期差：比较两个时期相同的字段，返回相差值
 * （10）Date.prototype.toArray：把日期分割成数组：按数组序号分别为：年月日时分秒
 * （11）Date.prototype.datePart：取得日期数据信息
 */

/**
 * 日期合法性验证：判断dataStr是否符合formatStr指定的日期格式
 * 示例：
 * （1）alert(Date.isValiDate('2008-02-29','yyyy-MM-dd'));//true
 * （2）alert(Date.isValiDate('aaaa-58-29','yyyy-MM-dd'));//false
 * dateStr：必选，日期字符串
 * formatStr：可选，格式字符串，可选格式有：(1)yyyy-MM-dd(默认格式)或YYYY-MM-DD (2)yyyy/MM/dd或YYYY/MM/DD (3)MM-dd-yyyy或MM-DD-YYYY
 * (4)MM/dd/yyyy或MM/DD/YYYY
 */
define( function ( require, exports, module ) {
	Date.isValiDate = function ( dateStr, formatStr ) {
		if ( !dateStr ) {
			return false;
		}
		if ( !formatStr ) {
			formatStr = "yyyy-MM-dd";//默认格式：yyyy-MM-dd
		}
		if ( dateStr.length != formatStr.length ) {
			return false;
		} else {
			if ( formatStr == "yyyy-MM-dd" || formatStr == "YYYY-MM-DD" ) {
				var r1 = /^(((((([02468][048])|([13579][26]))(00))|(d{2}(([02468][48])|([13579][26]))))-((((0[13578])|(1[02]))-(([0-2][0-9])|(3[01])))|(((0[469])|(11))-(([0-2][0-9])|(30)))|(02-([0-2][0-9]))))|(d{2}(([02468][1235679])|([13579][01345789]))-((((0[13578])|(1[02]))-(([0-2][0-9])|(3[01])))|(((0[469])|(11))-(([0-2][0-9])|(30)))|(02-(([0-1][0-9])|(2[0-8]))))))$/;

				return r1.test( dateStr );
			} else if ( formatStr == "yyyy/MM/dd" || formatStr == "YYYY/MM/DD" ) {
				var r2 = /^(((((([02468][048])|([13579][26]))(00))|(d{2}(([02468][48])|([13579][26]))))\/((((0[13578])|(1[02]))\/(([0-2][0-9])|(3[01])))|(((0[469])|(11))\/(([0-2][0-9])|(30)))|(02\/([0-2][0-9]))))|(d{2}(([02468][1235679])|([13579][01345789]))\/((((0[13578])|(1[02]))\/(([0-2][0-9])|(3[01])))|(((0[469])|(11))\/(([0-2][0-9])|(30)))|(02\/(([0-1][0-9])|(2[0-8]))))))$/;

				return r2.test( dateStr );
			} else if ( formatStr == "MM-dd-yyyy" || formatStr == "MM-DD-YYYY" ) {
				var r3 = /^((((((0[13578])|(1[02]))-(([0-2][0-9])|(3[01])))|(((0[469])|(11))-(([0-2][0-9])|(30)))|(02-([0-2][0-9])))-(((([02468][048])|([13579][26]))(00))|(d{2}(([02468][48])|([13579][26])))))|(((((0[13578])|(1[02]))-(([0-2][0-9])|(3[01])))|(((0[469])|(11))-(([0-2][0-9])|(30)))|(02-(([0-1][0-9])|(2[0-8])))))-d{2}(([02468][1235679])|([13579][01345789])))$/;

				return r3.test( dateStr );
			} else if ( formatStr == "MM/dd/yyyy" || formatStr == "MM/DD/YYYY" ) {
				var r4 = /^((((((0[13578])|(1[02]))\/(([0-2][0-9])|(3[01])))|(((0[469])|(11))\/(([0-2][0-9])|(30)))|(02\/([0-2][0-9])))\/(((([02468][048])|([13579][26]))(00))|(d{2}(([02468][48])|([13579][26])))))|(((((0[13578])|(1[02]))\/(([0-2][0-9])|(3[01])))|(((0[469])|(11))\/(([0-2][0-9])|(30)))|(02\/(([0-1][0-9])|(2[0-8])))))\/d{2}(([02468][1235679])|([13579][01345789])))$/;

				return r4.test( dateStr );
			} else {
				alert( "日期格式不正确！" );
				return false;
			}
		}
		return false;
	};
	
	/**
	 * 时间合法性验证：判断timeStr是否符合formatStr指定的时间格式
	 * 示例：
	 * （1）alert(Date.isValiTime('23:59:59','hh:mm:ss'));//true
	 * （2）alert(Date.isValiTime('24-68-89','hh:mm:ss'));//false
	 * timeStr：必选，日期字符串
	 * formatStr：可选，格式字符串，可选格式有：(1)hh:mm:ss(默认格式) (2)hh-mm-ss (3)hh/mm/ss
	 */
	Date.isValiTime = function ( timeStr, formatStr ) {
		if ( !timeStr ) {
			return false;
		}
		if ( !formatStr ) {
			formatStr = "hh:mm:ss";//默认格式：hh:mm:ss
		}
		if ( timeStr.length != formatStr.length ) {
			return false;
		} else {
			if ( formatStr == "hh:mm:ss" ) {
				var r1 = /^(([0-1][0-9])|(2[0-3])):([0-5][0-9]):([0-5][0-9])$/;

				return r1.test( timeStr );
			} else if ( formatStr == "hh-mm-ss" ) {
				var r2 = /^(([0-1][0-9])|(2[0-3]))-([0-5][0-9])-([0-5][0-9])$/;

				return r2.test( timeStr );
			} else if ( formatStr == "hh/mm/ss" ) {
				var r3 = /^(([0-1][0-9])|(2[0-3]))\/([0-5][0-9])\/([0-5][0-9])$/;

				return r3.test( timeStr );
			} else {
				alert( "时间格式不正确！" );
				return false;
			}
		}
		return false;
	};
	
	/**
	 * 日期和时间合法性验证
	 * 格式：yyyy-MM-dd hh:mm:ss
	 */
	Date.isValiDateTime = function ( dateTimeStr ) {
		var dateTimeReg = /^(((((([02468][048])|([13579][26]))(00))|(d{2}(([02468][48])|([13579][26]))))-((((0[13578])|(1[02]))-(([0-2][0-9])|(3[01])))|(((0[469])|(11))-(([0-2][0-9])|(30)))|(02-([0-2][0-9]))))|(d{2}(([02468][1235679])|([13579][01345789]))-((((0[13578])|(1[02]))-(([0-2][0-9])|(3[01])))|(((0[469])|(11))-(([0-2][0-9])|(30)))|(02-(([0-1][0-9])|(2[0-8]))))))(s{1}(([0-1][0-9])|(2[0-3])):([0-5][0-9]):([0-5][0-9]))?$/;

		return dateTimeReg.test( dateTimeStr );
	};
	/**
	 * 获取月份中的最大日期,主要是闰年判断
	 * @param y	年
	 * @param M	月
	 * @returns
	 */
	Date.maxDay = function ( y, M ) {
		var d1 = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
		var d2 = [ 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

		if ( ( y % 4 == 0 && ( y % 100 != 0 ) ) || ( y % 400 == 0 ) ) {
			return d2[ M - 1 ];
		} else {
			return d1[ M - 1 ];
		}
	};
	/**
	 * 月份中的最小时间
	 * @param y	年
	 * @param M 月
	 * @returns {Date}
	 */
	Date.minDateTime = function ( y, M ) {
		return new Date( y, M - 1, 1, 0, 0, 0, 0 );
	};
	/**
	 * 月份中的最大时间
	 * @param y	年
	 * @param M	月
	 * @returns {Date}
	 */
	Date.maxDateTime = function ( y, M ) {
		return new Date( y, M - 1, Date.maxDay( y, M ), 23, 59, 59, 999 );
	};
	
	/**
	 * 判断闰年 ：一般规律为：四年一闰，百年不闰，四百年再闰。
	 */
	Date.prototype.isLeapYear = function () {
		return ( ( this.getYear() % 4 == 0 && ( this.getYear() % 100 != 0 ) ) || ( this.getYear() % 400 == 0 ) );
	};
	
	/**
	 * 日期格式化：
	 * formatStr：可选，格式字符串，默认格式：yyyy-MM-dd hh:mm:ss
	 * 约定如下格式：
	 * （1）YYYY/yyyy/YY/yy 表示年份
	 * （2）MM/M 月份
	 * （3）W/w 星期
	 * （4）dd/DD/d/D 日期
	 * （5）hh/HH/h/H 时间
	 * （6）mm/m 分钟
	 * （7）ss/SS/s/S 秒
	 * （8）iii 毫秒
	 */
	Date.prototype.format = function ( formatStr ) {
		var str = formatStr;

		if ( !formatStr ) {
			str = "yyyy-MM-dd hh:mm:ss";//默认格式
		}
		var Week = [ "日", "一", "二", "三", "四", "五", "六" ];
	    
		str = str.replace( /yyyy|YYYY/, this.getFullYear() );
		str = str.replace ( /yy|YY/,
			( this.getYear () % 100 ) > 9 ? ( this.getYear () % 100 ).toString () : "0" + ( this.getYear () % 100 ) );

		str = str.replace ( /MM/, this.getMonth () >= 9 ? ( parseInt ( this.getMonth () ) + 1 ).toString () :
		"0" + ( parseInt ( this.getMonth () ) + 1 ) );
		str = str.replace( /M/g, ( parseInt( this.getMonth() ) + 1 ) );
	    
		str = str.replace( /w|W/g, Week[ this.getDay() ] );

		str = str.replace ( /dd|DD/, this.getDate () > 9 ? this.getDate ().toString () : "0" + this.getDate () );
		str = str.replace( /d|D/g, this.getDate() );

		str = str.replace ( /hh|HH/, this.getHours () > 9 ? this.getHours ().toString () : "0" + this.getHours () );
		str = str.replace( /h|H/g, this.getHours() );
		str = str.replace ( /mm/, this.getMinutes () > 9 ? this.getMinutes ().toString () : "0" + this.getMinutes () );
		str = str.replace( /m/g, this.getMinutes() );

		str = str.replace ( /ss|SS/,
			this.getSeconds () > 9 ? this.getSeconds ().toString () : "0" + this.getSeconds () );
		str = str.replace( /s|S/g, this.getSeconds() );

		str = str.replace ( /iii/g, this.getMilliseconds () < 10 ? "00" + this.getMilliseconds () :
			( this.getMilliseconds () < 100 ? "0" + this.getMilliseconds () : this.getMilliseconds () ) );
	    
		return str;
	};
	
	/**
	 * 字符串转成日期类型：
	 * dateStr：必选，日期字符串，如果无法解析成日期类型，返回null
	 * 格式：
	 * （1）yyyy/MM/dd：IE和FF通用
	 * （2）MM/dd/yyyy：IE和FF通用
	 * （3）MM-dd-yyyy：仅IE
	 * （4）yyyy-MM-dd：非IE，且时钟被解析在8点整
	 */
	Date.stringToDate = function ( dateStr ) {
		if ( !dateStr ) {
			alert( "字符串无法解析为日期" );
			return null;
		} else {
			if ( Date.isValiDate( dateStr, "yyyy/MM/dd" ) || Date.isValiDate( dateStr, "MM/dd/yyyy" ) ) {
				return new Date( Date.parse( dateStr ) );
			} else {
				if ( ( !-[ 1, ] ) ) {//IE
					if ( Date.isValiDate( dateStr, "MM-dd-yyyy" ) ) {
						return new Date( Date.parse( dateStr ) );
					} else {
						alert( "字符串无法解析为日期" );
						return null;
					}
				} else {//非IE
					if ( Date.isValiDate( dateStr, "yyyy-MM-dd" ) ) {
						return new Date( Date.parse( dateStr ) );
					} else {
						alert( "字符串无法解析为日期" );
						return null;
					}
				}
			}
		}
		return null;
	};
	
	/**
	 * 计算两个日期的天数差：
	 * dateOne：必选，必须是Data类型的实例
	 * dateTwo：必选，必须是Data类型的实例
	 */
	Date.daysBetween = function ( dateOne, dateTwo ) {
		if ( ( dateOne instanceof Date ) == false || ( dateTwo instanceof Date ) == false ) {
			return 0;
		} else {
			return Math.abs( Math.floor( ( dateOne.getTime() - dateTwo.getTime() ) / 1000 / 60 / 60 / 24 ) );
		}
	};
	/**
	 * 比较两个时间
	 * @param dateOne
	 * @param dateTwo
	 * @returns	相等:0,大于:1,小于:-1
	 */
	Date.compare = function ( dateOne, dateTwo ) {
		if ( dateOne.eq( dateTwo ) )
			return 0;
		else if ( dateOne.gt( dateTwo ) )
			return 1;
		else if ( dateOne.lt( dateTwo ) )
			return -1;
		else
			return null;
	};
	
	/**
	 * 日期计算：支持负数，即可加可减，返回计算后的日期
	 * num：必选，必须是数字，且正数是时期加，负数是日期减
	 * field：可选，标识是在哪个字段上进行相加或相减，字段见如下的约定。无此参数时，默认为d
	 * 约定如下格式：
	 * （1）Y/y 年
	
	 * （2）M 月
	 * （3）W/w 周
	 * （4）D/d 日
	 * （5）H/h 时
	 * （6）m 分
	 * （7）S/s 秒
	 * （8）Q/q 季
	 */
	Date.prototype.dateAdd = function ( num, field ) {
		if ( ( !num ) || isNaN( num ) || parseInt( num ) == 0 ) {
			return this;
		}
		if ( !field ) {
			field = "d";
		}
		switch ( field ){
			case "Y":
			case "y":
				return new Date ( ( this.getFullYear () + num ), this.getMonth (), this.getDate (), this.getHours (),
					this.getMinutes (), this.getSeconds () );
				break;
			case "Q":
			case "q":
				return new Date ( this.getFullYear (), ( this.getMonth () + num * 3 ), this.getDate (), this.getHours (),
					this.getMinutes (), this.getSeconds () );
				break;
			case "M":
				return new Date ( this.getFullYear (), this.getMonth () + num, this.getDate (), this.getHours (),
					this.getMinutes (), this.getSeconds () );
				break;
			case "W":
			case "w":
				return new Date ( Date.parse ( this ) + ( ( 86400000 * 7 ) * num ) );
				break;
			case "D":
			case "d":
				return new Date ( Date.parse ( this ) + ( 86400000 * num ) );
				break;
			case "H":
			case "h":
				return new Date ( Date.parse ( this ) + ( 3600000 * num ) );
				break;
			case "m":
				return new Date ( Date.parse ( this ) + ( 60000 * num ) );
				break;
			case "S":
			case "s":
				return new Date ( Date.parse ( this ) + ( 1000 * num ) );
				break;
			default: return this;
		}
		return this;
	};
	
	/**
	 * 比较日期差：比较两个时期相同的字段，返回相差值
	 * dtEnd：必选，必须是Data类型的实例
	 * field：可选，标识是在哪个字段上进行比较，字段见如下的约定。无此参数时，默认为d
	 * 约定如下格式：
	 * （1）Y/y 年
	 * （2）M 月
	 * （3）W/w 周
	 * （4）D/d 日
	 * （5）H/h 时
	 * （6）m 分
	 * （7）S/s 秒
	 */
	Date.prototype.dateDiff = function ( dtEnd, field ) {
		var dtStart = this;

		if ( ( dtEnd instanceof Date ) == false ) {
			return 0;
		} else {
			if ( !field ) {
				field = "d";
			}
			switch ( field ){
				case "Y":
				case "y":
					return dtEnd.getFullYear () - dtStart.getFullYear ();
					break;
				case "M":
					return ( dtEnd.getMonth () + 1 ) + ( ( dtEnd.getFullYear () - dtStart.getFullYear () ) * 12 ) - ( dtStart.getMonth () + 1 );
					break;
				case "W":
				case "w":
					return parseInt ( ( dtEnd - dtStart ) / ( 86400000 * 7 ) );
					break;
				case "D":
				case "d":
					return parseInt ( ( dtEnd - dtStart ) / 86400000 );
					break;
				case "H":
				case "h":
					return parseInt ( ( dtEnd - dtStart ) / 3600000 );
					break;
				case "m":
					return parseInt ( ( dtEnd - dtStart ) / 60000 );
					break;
				case "S":
				case "s":
					return parseInt ( ( dtEnd - dtStart ) / 1000 );
					break;
				default: return 0;
			}
			return 0;
		}
	};
	
	/**
	 * 把日期分割成数组：按数组序号分别为：年月日时分秒
	 */
	Date.prototype.toArray = function () {
		var myArray = new Array();

		myArray[ 0 ] = this.getFullYear();
		myArray[ 1 ] = this.getMonth();
		myArray[ 2 ] = this.getDate();
		myArray[ 3 ] = this.getHours();
		myArray[ 4 ] = this.getMinutes();
		myArray[ 5 ] = this.getSeconds();
		return myArray;
	};
	
	/**
	 * 取得日期数据信息：
	 * field：可选，标识是在哪个字段上进行比较，字段见如下的约定。无此参数时，默认为d
	 * （1）Y/y 年
	 * （2）M 月
	 * （3）W/w 周
	 * （4）D/d 日
	 * （5）H/h 时
	 * （6）m 分
	 * （7）S/s 秒
	 */
	Date.prototype.datePart = function ( field ) {
		if ( !field ) {
			field = "d";
		}
		var Week = [ "日", "一", "二", "三", "四", "五", "六" ];

		switch ( field ){
			case "Y" :
			case "y" :
				return this.getFullYear ();
				break;
			case "M" :
				return ( this.getMonth () + 1 );
				break;
			case "W" :
			case "w" :
				return Week[ this.getDay () ];
				break;
			case "D" :
			case "d" :
				return this.getDate ();
				break;
			case "H" :
			case "h" :
				return this.getHours ();
				break;
			case "m" :
				return this.getMinutes ();
				break;
			case "s" :
				return this.getSeconds ();
				break;
			default:return this.getDate();
		}
		return this.getDate();
	};
	/**
	 * 判断是否和传入的时间相等
	 * @param date
	 * @returns {Boolean}
	 */
	Date.prototype.eq = function ( date ) {
		if ( ( date instanceof Date ) == false ) {
			return false;
		}
		return this.getTime() === date.getTime();
	};
	/**
	 * 判断是否大于传入的时间
	 * @param date
	 * @returns {Boolean}
	 */
	Date.prototype.gt = function ( date ) {
		if ( ( date instanceof Date ) == false ) {
			return false;
		}
		return this.getTime() > date.getTime();
	};
	/**
	 * 判断是否小于传入的时间
	 * @param date
	 * @returns {Boolean}
	 */
	Date.prototype.lt = function ( date ) {
		if ( ( date instanceof Date ) == false ) {
			return false;
		}
		return this.getTime() < date.getTime();
	};
	/**
	 * 和传入的时间进行比较
	 * @param date
	 * @returns	相等:0,大于:1,小于:-1
	 */
	Date.prototype.compareTo = function ( date ) {
		if ( this.eq( date ) )
			return 0;
		else if ( this.gt( date ) )
			return 1;
		else if ( this.lt( date ) )
			return -1;
		else
			return null;
	};
	return Date;
} );
