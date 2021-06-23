class RemoveRetroUrl < ActiveRecord::Migration[5.2]
  def change
    remove_column :retros, :retro_url
  end
end
