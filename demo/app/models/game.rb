class Game < ActiveRecord::Base
  validates_presence_of :name
  validates_numericality_of :link, :greater_than => 0
end
