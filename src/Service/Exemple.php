<?php



class Exemple {

    private User $user ;
    private UserRepository $userRepository;

    public function __construct(User $user){
        $this->user = new user();
    }

    public function login(){
        $password = $this->user->getPassword();
        $email = $this->user->getEmail();

        $userDb = $this->UserRepository->getUserByEmail($email);

        if($userDb->getPassword() == $password && $userDb->getEmail == $email) {
            return "this user is connected ";
        }else{
            return"the password or email is uncorecte";
        }



        
    }




}

