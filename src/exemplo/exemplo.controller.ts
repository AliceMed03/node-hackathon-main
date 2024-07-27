import { Controller, Get, Query } from "@nestjs/common";
import { ExemploService } from "./exemplo.service";

@Controller("exemplo")
export class ExemploController {
  constructor(private readonly exemploService: ExemploService) {}

  @Get("GetAmbienteUsuario")
  getAmbienteUsuario(
    @Query("authorization") authorization: string,
    @Query("codigoUsuario") codigoUsuario: string,
    @Query("codigoUnidade") codigoUnidade: string,
  ) {
    return this.exemploService.getAmbienteUsuario(
      authorization,
      codigoUsuario,
      codigoUnidade,
    );
  }

  @Get("GetEnums")
  getEnums(@Query("authorization") authorization: string) {
    return this.exemploService.getEnums(authorization);
  }




  @Get("GetNfp")
  
  getNfp(
    @Query("authorization") authorization: string,
    @Query("valorVenda") valorVenda: string,
    @Query("valorRecebido") valorRecebido: string,

  ) {
    return this.exemploService.getNfp(
      authorization,
      valorVenda,
      valorRecebido,
    );
  }

  @Get("CalcularTempoEconomizado")
  calcularTempoEconomizado(
    @Query("authorization") authorization: string,
  ) {
    return this.exemploService.calcularTempoEconomizado(
      authorization
    );

  }

  @Get("CalcularPossivelGanho")
  calcularPossivelGanho(
    @Query("authorization") authorization: string,
  ) {
    return this.exemploService.calcularPossivelGanho(
      authorization
    );
  }

  




}
