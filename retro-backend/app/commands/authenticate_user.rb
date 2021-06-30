class AuthenticateUser
    prepend SimpleCommand
  
    def initialize(email, password)
      @email = email
      @password = password
    end
  
    def call
      puts "aaasadadadadadadadada",  user.id
      token = JsonWebToken.encode(user_id: user.id) if user 
      hash  = {token: token, user_id: user.id}
      return hash
    end
  
    private
  
    attr_accessor :email, :password
  
    def user
      user = User.find_by_email(email)
      return user if user && user.authenticate(password)
  
      errors.add :user_authentication, 'invalid credentials'
      nil
    end
  end
  