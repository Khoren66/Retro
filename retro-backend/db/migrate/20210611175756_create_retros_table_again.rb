class CreateRetrosTableAgain < ActiveRecord::Migration[5.2]
    def change
      create_table :retros do |t|
        t.string "team_name", default: '', null: false
        t.string "retro_url"
        t.boolean "active"
        t.string "retro_id" ,default: Time.now.to_i
        t.belongs_to :user
        t.timestamps
      end
    end
  
end
