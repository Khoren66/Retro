class CreateCards < ActiveRecord::Migration[5.2]
  def change
    create_table :cards do |t|
      t.string "type", null: false
      t.string "text"
      t.integer "votes"
      t.string "created_by"
      t.belongs_to :retro
      t.timestamps
    end
  end
end
