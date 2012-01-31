task :deploy do
  sh "sudo perl -e 'mkdir \"/var/www/tetris\" unless -e \"/var/www/tetris\"'"
  sh "sudo cp index.html /var/www/tetris"
  sh "sudo cp tetris.js /var/www/tetris"
end

task :default => :deploy
