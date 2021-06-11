class CreateRetros < ActiveRecord::Migration[5.2]
  def change
    create_table :retros do |t|
      t.string "team_name", default: '', null: false
      t.string "retro_url"
      t.boolean "active"
      t.belongs_to :user
      t.timestamps
    end
  end
end
