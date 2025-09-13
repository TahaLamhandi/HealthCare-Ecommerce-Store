<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Database\Seeders\CleanDatabaseSeeder;

class CleanDatabase extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'db:clean';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clean database and seed only 4 products and 4 categories';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $this->info('🧹 Cleaning database...');
        
        // Run the clean seeder
        $seeder = new CleanDatabaseSeeder();
        $seeder->run();
        
        $this->info('✅ Database cleaned successfully!');
        $this->info('📦 Only 4 categories remain: Compléments alimentaires, Aromathérapie, Nutrition naturelle, Cosmétique naturelle');
        $this->info('💊 Only 4 products remain: Zitalgic®, Zitalgic® Sport, Detoxoil®, Relaxoil®');
        
        return Command::SUCCESS;
    }
}
