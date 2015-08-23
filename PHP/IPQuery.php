<?php

class IPQuery {
	private static $_requestURL = 'http://ip.taobao.com/service/getIpInfo.php';
	public static function getIPInfo($ip){
		$long = ip2long($ip);
		if($long === 0){
			throw new Exception('IP address error', 5);
		}
		$ip=long2ip($long);
		$IPInfo = self::queryIPInfo($ip);
		return self::parseJSON($IPInfo);
	}
	
	private static function queryIPInfo($ip){
		$query = http_build_query(array('ip'=>$ip));
		$ch = curl_init();
		$options = array(
				CURLOPT_URL => sprintf('%s?%s', self::$_requestURL, $query),
				CURLOPT_RETURNTRANSFER => true,
				CURLOPT_AUTOREFERER => false,
				CURLOPT_FOLLOWLOCATION => false,
				CURLOPT_HEADER => false,
				CURLOPT_TIMEOUT => 3.0,
		);
		curl_setopt_array($ch, $options);
		$content = curl_exec($ch);
		curl_close($ch);
		return $content;
	}
	
	private static function parseJSON($json){
		$O = json_decode ($json, true);
	
		if(false === is_null($O)){
			return $O;
		}
		if (version_compare(PHP_VERSION, '5.3.0', '>=')) {
			$errorCode = json_last_error();
			if(isset(self::$_JSONParseError[$errorCode])){
				throw new Exception(self::$_JSONParseError[$errorCode], 5);
			}
		}
		throw new Exception('JSON parse error', 5);
	}
	
	private static $_JSONParseError = array(
			JSON_ERROR_NONE=>'No error has occurred',
			JSON_ERROR_DEPTH=>'The maximum stack depth has been exceeded',
			JSON_ERROR_CTRL_CHAR=>'Control character error, possibly incorrectly encoded',
			JSON_ERROR_STATE_MISMATCH=>'Invalid or malformed JSON',
			JSON_ERROR_SYNTAX=>'Syntax error',
			JSON_ERROR_UTF8=>'Malformed UTF-8 characters, possibly incorrectly encoded',
	);
}


