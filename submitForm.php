<?php

//extract submitted values from POST superglobal
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = htmlspecialchars($_POST['name']);
    $company = htmlspecialchars($_POST['company']);
    $email = htmlspecialchars($_POST['email']);
    $phone = htmlspecialchars($_POST['phone']);
    $message = htmlspecialchars($_POST['message']);

    //compose email
    $to = "erikvlcak1@gmail.com";
    $subject = "New form submission.";
    $body = "Name: $name\nCompany: $company\nEmail: $email\nPhone: $phone\nMessage: $message";
    $headers = "From: $email";

    // Here I would use -
    //mail($to, $subject, $body, $headers);
    // - but since mailserver is not configured, it will generate an error.

    //To skip it and simulate successful/unsuccessful submission of email, alter $mailSent value
    $mailSent = true;

    if ($mailSent) {
        $response = ['status' => 'success'];
    } else {
        $response = ['status' => 'fail'];
    }
} else {
    $response = ['status' => 'invalid'];
}

//send json response
header('Content-type: application/json');
echo json_encode($response);
