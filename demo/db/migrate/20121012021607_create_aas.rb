class CreateAas < ActiveRecord::Migration
  def change
    create_table :aas do |t|

      t.timestamps
    end
  end
end
