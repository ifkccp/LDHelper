<?php

error_reporting(0);
$action = $_GET['action'];

$user_file = 'data/user.db';
$log_file = 'data/'.date('Y_m_d.').'log';
if(!is_dir('data'))
{
	mkdir('data');
}

switch($action)
{
	case 'get_info':
		$uid = intval($_GET['uid']);
		$name = 'unknown';
		if(file_exists($user_file))
		{
			$users = json_decode(file_get_contents($user_file), true);
			if($users[$uid])
			{
				$name = $users[$uid];
			}
		}
		echo $name;
		break;
	case 'report':
		$host = $_GET['from'];
		$uid = $_GET['uid'];
		$ld = $_GET['ld'];

		if($f = fopen($log_file, 'a'))
		{
			$words = sprintf("[%s] %s %s %s\n", date('Y-m-d H:i:s', $host, $uid, $ld));
			fwrite($f, $words);
			fclose($f);
		}

		$users = array();
		if(file_exists($user_file))
		{
			$users = json_decode(file_get_contents($user_file), true);
		}
		if(!array_key_exists($uid, $users))
		{
			$users[$uid] = '';
			file_put_contents($user_file, json_encode($users));
		}

		break;
	default:break;
}
