<?php
namespace src\Service;
use src\Entity\User;
use src\Database\DatabaseConnection;
use src\Repository\UserRepository;

class Auth{
    /* private string $firstname;
    private string $lastname;
    private string $email;
    private string $password;
    private string $role; */
    private User $user;
    private UserRepository $userRepo;
    public function __construct(){
        $this->user = new User();
        /* $this->user = new User(); */
        $db = new DatabaseConnection();
        $this->userRepo = new UserRepository($db);
    }
    
    public function Register(){
        // if(empty($firstname) || empty($lastname) || empty($email) || empty($password) || empty($role)){
        //     return "input is empty";
        // }
        if($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST['register'])){
            $this->user->setFirstname($_POST['firstname']);
            $this->user->setLastname($_POST['lastname']);
            $this->user->setEmail($_POST['email']);
            $this->user->setPassword($_POST['password']);
            $this->user->setRole($_POST['role']);
            if(empty($this->user->getFirstname()) || empty($this->user->getLastname()) || empty($this->user->getEmail()) || empty($this->user->getPassword()) || empty($this->user->getRole())){
                return "input is empty";
            }
            $email = $this->user->getEmail();
            if($this->userRepo->getUserByEmail($email)){
                header('Location: ../../view/auth/register.html');
                return "Email already exists.";
            }
            $success = $this->userRepo->createUser(
                $this->user->getFirstname(),
                $this->user->getLastname(),
                $this->user->getEmail(),
                $this->user->getPassword(),
                $this->user->getRole(),
            );
            if ($success) {
                header('Location: ../../view/auth/login.html');
                exit();
            } else {
                return "Registration failed in database.";
            }
        }
    }

    public function Login(){
        if($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST['login'])){
            $this->user->setEmail($_POST['email']);
            $this->user->setPassword($_POST['password']);
            $dbUser = $this->userRepo->getUserByEmail($this->user->getEmail());
            if($dbUser){
                if(trim($dbUser->getPassword()) === trim($this->user->getPassword())){
                    if(session_status() === PHP_SESSION_NONE){
                        session_start();
                    }
                    $_SESSION['user_id'] = $dbUser->getId();
                    $_SESSION['email'] = $dbUser->getEmail();
                    $_SESSION['role'] = $dbUser->getRole();
                    $_SESSION['firstname'] = $dbUser->getFirstname();
                    $_SESSION['lastname'] = $dbUser->getLastname();
                    $_SESSION['password'] = $dbUser->getPassword();
                    if($dbUser->getRole() === 'livreur'){
                        header('Location: ../view/livreur/dashboard.php');
                        exit();
                    }else{
                        header('Location: ../view/client/dashboard.php');
                        exit();
                    }
                }else{
                    die("Mot de passe incorrect !");
                }
            }else{
                die("Utilisateur introuvable avec cet email !");
            }
        }else{
            die("Le bouton login n'a pas été cliqué ou n'a pas de name='login'");
        }
    }

    public function Logout(){
    $_SESSION = array();
    if (session_id() != "" || isset($_COOKIE[session_name()])) {
        session_destroy();
    }
    header('Location: ../view/auth/login.php');
    exit();
}
}
