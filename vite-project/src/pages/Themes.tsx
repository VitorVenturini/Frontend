export default function Themes() {
    // Lista de nomes de variáveis CSS
    const colorNames = [
        'background',
        'foreground',
        'card',
        'card-foreground',
        'popover',
        'popover-foreground',
        'primary',
        'primary-foreground',
        'secondary',
        'secondary-foreground',
        'muted',
        'muted-foreground',
        'accent',
        'accent-foreground',
        'destructive',
        'destructive-foreground',
        'border',
        'input',
        'ring',
    ];

    // Obtenha os valores das variáveis CSS
    const colors = colorNames.map(name => {
        const colorValue = getComputedStyle(document.documentElement)
            .getPropertyValue(`--${name}`)
            .trim();
        return { name, color:`hsl(${colorValue})` };
    });
    

    return (
        <div>
            <h1>Temas</h1>
            {colors.map((color, index) => (
                <div key={index} style={{
                    backgroundColor: color.color,
                    width: '100px',
                    height: '100px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    margin: '10px'
                }}>
                    {color.name}
                </div>
            ))}
        </div>
        
    )
}