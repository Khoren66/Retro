class RenameRetroIdToSlugInRetrosTable < ActiveRecord::Migration[5.2]
  def change
    rename_column :retros, :retro_id, :slug
  end
end
