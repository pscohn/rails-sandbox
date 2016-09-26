class User < ApplicationRecord
  has_secure_password
  before_save { self.email = email.downcase }
  validates :name,  presence: true, length: { maximum: 50 }
  validates :email, presence: true, length: { maximum: 255 }, uniqueness: { case_sensitive: false }
  validates :password, presence: true, length: { minimum: 6 }
end
