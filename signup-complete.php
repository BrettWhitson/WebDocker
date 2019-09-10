<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="./resources/signupstyle.css">
    <title>Document</title>
</head>
<body>
    <div class="box">
        <h1 id="congrats">Congratulations!</h1>
        <h1> Welcome to WebDocker, <br><?="{$_GET["fname"]} {$_GET["lname"]}."?></h1>
        <h1> A confirmation email has been sent to: <h3><?="{$_GET["email"]}"?></h3></h1>
    </div>
</body>
</html>