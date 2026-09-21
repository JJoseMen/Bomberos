import { Controller, Delete, ForbiddenException, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { DevService } from './dev.service';

@ApiTags('Dev (solo desarrollo)')
@Controller('dev')
export class DevController {
  constructor(private devService: DevService) {}

  @Delete('usuarios/:email')
  @Public()
  @ApiOperation({ summary: 'Eliminar usuario por email (SOLO desarrollo)' })
  async eliminarUsuario(@Param('email') email: string) {
    const env = process.env.NODE_ENV;
    if (env !== 'development') {
      throw new ForbiddenException('Endpoint disponible solo en desarrollo');
    }
    return this.devService.eliminarUsuarioPorEmail(email);
  }
}
