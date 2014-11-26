<html>
<head>
	<meta charset="utf-8">
	<title>Форма ввода паспортных данных</title>
	<link rel="stylesheet" href="css/reset.css" />
	<link rel="stylesheet" href="css/styles.css" />
	<link rel="stylesheet" href="css/pasp.css" />
	<link rel="shortcut icon" href="img/favicon.png" />
	<script type="text/javascript" src="js/jquery.js"></script>
</head>
<body>
	<div id="wrapper">
		<header>
		    <div class="header_inner main">    
			<div class="header_logo"><img src="img/header_logo.png" alt=""></div>
			<div class="header_title">
				<p>RC COFFEE</p>Межрегиональная сеть баров кофе с собой
			</div>
			<!--div class="header_desc">
				<h1>Ввод паспортных данных</h1>
			</div-->
			<div class="header_callback">
				<div class="header_phone">+7 (800) 700 56 80</div>
			</div>
		    </div>
		</header>
		<div class = "pasp_form blurred"></div>
		<div class = "pasp_form">
			<form class="passp_fill" enctype="multipart/form-data" action="sendMail.php" method="POST">
				<h1>Ввод паспортных данных</h1>
				<input type="text" name="fio" placeholder="ФИО">
				<input type="date" name="birthday" placeholder="Дата рождения"/>
				<input type="text" name="address" placeholder="Адрес по прописке"/>
				<input type="number" name="zip" placeholder="Индекс"/>
				<input type="number" name="pserial" placeholder="Серия"/>
				<input type="number" name="pnumber" placeholder="Номер"/>
				<input type="date" name="date" placeholder="Дата выдачи"/>
				<input type="text" name="fms" placeholder="Кем выдан"/>
				<br>Паспорт: <input name="userfile" type="file" />
				<br><input type="submit" value="Отправить" />
			</form>
		</div>
	</div>
</body>