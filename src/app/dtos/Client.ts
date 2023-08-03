export interface ClientDTO {
    id: string;
    codigo: string;
    nome: string;
    fantasia: string;
    tipo: string;
    cnpj: string;
    ie_rg: string;
    endereco: string;
    numero: string;
    bairro: string;
    cep: string;
    cidade: string;
    complemento: string;
    uf: string;
    fone: string;
    email: string;
    situacao: string;
    contribuinte: string;
    site: string;
    celular: string;
    dataAlteracao: string;
    dataInclusao: string;
    sexo: string;
    clienteDesde: string;
    dataNascimento: string;
    tiposContato: TipoContato[];
    informacoesContato: string;
  }
  
  interface TipoContato {
    tipoContato: {
      descricao: string;
    };
  }
  