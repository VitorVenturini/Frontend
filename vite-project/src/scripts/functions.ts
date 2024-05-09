async function postRequest (formData: object,endPoint: string | URL | Request) {   
try {
    // Envia os dados para o backend via método POST
    const response = await fetch(endPoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    });
    const data = await response.json();
        return data;
    // Verifica se a requisição foi bem-sucedida
    if (response.ok) {
        // Extrai e exibe a resposta do backend na console
        const data = await response.json();
        return data;
        console.log('Resposta do backend:', data);

        // Armazena o token no localStorage
        localStorage.setItem('token', data.accessToken);
        
        // Redireciona para teste.html após a resposta ok
          window.location.href = '/Home';


    } else {
        console.error('Erro ao enviar dados para o backend:', response.statusText);

    }
} catch (error) {
    console.error('Erro:', error);
    return error;
}
}
module.exports = postRequest;