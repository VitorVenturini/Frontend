import { BotOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NoPage() {
    return (
        <div className='px-[200px]'>
            <div className='flex flex-col items-center justify-center h-[80vh] gap-4'>
                <h1 className='text-4xl font-bold'>404</h1>
                <p className='text-lg'>Página não encontrada</p>
                <BotOff size={200} />
                <Button asChild>
                    <a href="/Login">Voltar a pagina de Login</a>
                </Button>
            </div>
        </div>
    )
}