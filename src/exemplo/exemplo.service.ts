import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import axios from 'axios';

@Injectable()
export class ExemploService {
  constructor(private readonly httpService: HttpService) {}

  async getAmbienteUsuario(
    authorization: string,
    codigoUsuario: string,
    codigoUnidade: string,
  ) {
    const apiURL = 'https://api.sandbox.appnext.fit/api/';

    const headers = {
      Authorization: `${authorization}`,
    };

    const params = {
      CodigoUsuario: codigoUsuario,
      CodigoUnidade: 7
    };

    const response = await firstValueFrom(
      this.httpService.get(`${apiURL}Usuario/RecuperarAmbienteUsuario`, { headers, params }),
    );

    return response.data;
  }

  async getEnums(authorization: string) {
    const apiURL = 'https://api.sandbox.appnext.fit/api/';

    const headers = {
      Authorization: `${authorization}`,
    };

    const response = await firstValueFrom(
      this.httpService.get(`${apiURL}Enum/RecuperarTodos`, { headers }),
    );

    return response.data;
  }

  private calcularTaxaReal(valorVenda: number, valorRecebido: number): number {
    return (1 - (valorRecebido / valorVenda)) * 100;
  }

  async recuperarTaxaNfp(authorization: string): Promise<number> {
    const apiURL = 'https://api.sandbox.appnext.fit/api/ConfigPagtoOnline/RecuperarTabelaPrecoPayDisponivel';

    const headers = {
      Authorization: `${authorization}`,
    };

    const response = await firstValueFrom(
      this.httpService.get(apiURL, { headers }),
    );

    return response.data.Content.TaxaCredito1x;
  }


  async getNfp(authorization: string, valorVenda: string, valorRecebido: string) {
    const valorVendaNum = parseFloat(valorVenda);
    const valorRecebidoNum = parseFloat(valorRecebido);

    const taxaReal = this.calcularTaxaReal(valorVendaNum, valorRecebidoNum);
    const taxaNfp = await this.recuperarTaxaNfp(authorization);

    await this.painelAdm( `A taxa da maquininha é: ${taxaReal.toFixed(2)}%\nA taxa do Next fit pay é: ${taxaNfp.toFixed(2)}%`);

    return {
      taxaReal: parseFloat(taxaReal.toFixed(2)),
      taxaNfp
    };
  }

  async painelAdm(Observacao: string) {
    const apiURL = 'https://apiadm.nextfit.com.br/api/CadastroObservacao';
  
    const headers = {
      Authorization: `Bearer eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJmdW5jaW9uYXJpbyI6ImFsaWNlLm1lZGVpcm9zQG5leHRmaXQuY29tLmJyIiwiY29kaWdvRnVuY2lvbmFyaW8iOiIxNTQiLCJ0aXBvUGVyZmlsIjoiMiIsIm5iZiI6MTcyMjA5NDMwNywiZXhwIjoxNzIyMTAxNTA3LCJpc3MiOiJQYWluZWwgQWRtIE5leHQgRml0In0.R4Ki1eWK-sgkiKBsDfx2i3N-rN8J5nfrbYYMgSecvKgECaXiUFS-6aS9I3pe4idspWWTd7eL_qLj-AUT54rHIA`,
    };

    const dtoPainel = {
      CodigoCadastro: 2907,
      Tipo: 5,
      Observacao: Observacao
    };

    console.log(dtoPainel);

    await axios.post(apiURL, dtoPainel, { headers }).then(data => {
      console.log('DEU CERTO');
    }).catch((resp) => {
      console.log('DEU ERRADO', resp);
    });
  }

  // Novo método para obter a quantidade de alunos ativos
  async getQuantidadeAlunosAtivos(authorization: string): Promise<number> {
    const apiURL = 'https://api.sandbox.appnext.fit/api/Cliente/recuperarPesquisaGeral?CodigosUnidadesStr=%5B%5D&OrigemStr=%5B%5D&StatusStr=%5B1%5D';

    const headers = {
      Authorization: `${authorization}`,
    };
  console.log(authorization)

    const response = await firstValueFrom(this.httpService.get(apiURL, { headers }));
    
    console.log(response.data)

    return response.data.Total; //ajustar
  }

  // Novo método para calcular o tempo economizado
  async calcularTempoEconomizado(authorization: string): Promise<string> {
    const quantidadeAlunosAtivos = await this.getQuantidadeAlunosAtivos(authorization);
    const tempoEconomizadoPorAluno = 8; // minutos

    const tempoTotalEconomizado = quantidadeAlunosAtivos * tempoEconomizadoPorAluno;

    const horas = Math.floor(tempoTotalEconomizado / 60);
    const minutos = tempoTotalEconomizado % 60;

    await this.painelAdm(`Tempo economizado com NFP ativo: ${horas} horas e ${minutos} minutos.`);

    return `Tempo economizado com NFP ativo: ${horas} horas e ${minutos} minutos.`;
  }

  //Método Contas vencidas
  async getContasVencidas(authorization: string): Promise<number> {
    const apiURL = 'https://api.sandbox.appnext.fit/api/receber/recuperarTotalizadores?filter=%5B%7B%22property%22:%22Status%22,%22operator%22:%22in%22,%22value%22:%5B1%5D,%22and%22:true%7D,%7B%22property%22:%22DataVencimento%22,%22operator%22:%22greaterOrEqual%22,%22value%22:%222024-07-01T14:46:08.291Z%22,%22and%22:true%7D,%7B%22property%22:%22DataVencimento%22,%22operator%22:%22lessOrEqual%22,%22value%22:%222024-07-31T14:46:59.999Z%22,%22and%22:true%7D%5D';

    const headers = {
      Authorization: `${authorization}`,
    };
  console.log(authorization)

    const response = await firstValueFrom(this.httpService.get(apiURL, { headers }));
    
    console.log(response.data)

    return response.data.Content.Abertos; //ajustar
  }

  async calcularPossivelGanho(authorization: string): Promise<number> {
    const totalContasVencidas = await this.getContasVencidas(authorization);
    const percentual = 0.83;
    const possivelGanho = totalContasVencidas * percentual;

    await this.painelAdm(`Utilizando o Next Fit Pay, você pode obter até 83% do valor em aberto. Na prática você possui hoje R$${totalContasVencidas}, com o next fit pay você recuperaria o total de R$${parseFloat(possivelGanho.toFixed(2))}`);

    return parseFloat(possivelGanho.toFixed(2)); // duas casas decimais
  }


}
