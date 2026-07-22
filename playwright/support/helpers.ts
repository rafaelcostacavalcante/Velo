export function gerarCodigoPedido() {
    const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let sufixo = '';
    
    for (let i = 0; i < 6; i++) {
      const indiceAleatorio = Math.floor(Math.random() * letras.length);
      sufixo += letras[indiceAleatorio];
    }
    
    return `VLO-${sufixo}`;
  }