<?php

header("Content-Type: application/json");

$filename = "scoreboard.txt";

function read_scoreboard($filename) {
   if (!file_exists($filename)) {
      return [];
   }
   $data = file($filename, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
   $scoreboard = [];
   foreach ($data as $line) {
      list($username, $score) = explode(",", $line);
      $scoreboard[] = ["username" => trim($username), "score" => (int)trim($score)];
   }
   return $scoreboard;
}

function write_score($filename, $username, $score) {
   $entry = "$username,$score\n";
   file_put_contents($filename, $entry, FILE_APPEND);
}

if ($_SERVER['REQUEST_METHOD'] === "POST") {
   $input = json_decode(file_get_contents("php://input"), true);
   if (isset($input["username"]) && isset($input["score"])) {
      $username = $input["username"];
      $score = $input["score"];
      write_score($filename, $username, $score);
      echo json_encode(["message" => "Score added successfully"]);
   } else {
      echo json_encode(["error" => "Invalid input"]);
   }
} elseif ($_SERVER["REQUEST_METHOD"] === "GET") {
   $scoreboard = read_scoreboard($filename);
   echo json_encode($scoreboard);
} else {
   echo json_encode(["error" => "Invalid request method"]);
}
