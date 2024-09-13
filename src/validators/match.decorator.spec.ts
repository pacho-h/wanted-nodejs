import { validate } from 'class-validator';
import { IsMatchedTo } from './match.decorator';

class TestDto {
  password: string;

  @IsMatchedTo('password', { message: 'Passwords do not match' })
  passwordConfirmation: string;
}

describe('IsMatchedTo decorator', () => {
  it('should pass validation when passwords match', async () => {
    const dto = new TestDto();
    dto.password = 'validPassword';
    dto.passwordConfirmation = 'validPassword';

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should fail validation when passwords do not match', async () => {
    const dto = new TestDto();
    dto.password = 'validPassword';
    dto.passwordConfirmation = 'invalidPassword';

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toEqual({
      isMatchedTo: 'Passwords do not match',
    });
  });
});
