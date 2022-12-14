import { css } from '@emotion/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useRecoilState } from 'recoil';
import CommonButton from '../../components/CommonButton';
import TabTitle from '../../components/TabTitle';
import DescriptionInput from '../../components/walks/wirte/DescriptionInput';
import EveryWeekPicker from '../../components/walks/wirte/EveryWeekPicker';
import ImageUploadZone from '../../components/walks/wirte/ImageUploadZone';
import OneDayPicker from '../../components/walks/wirte/OneDayPicker';
import PersonCountInput from '../../components/walks/wirte/PersonCountInput';
import PlaceInput from '../../components/walks/wirte/PlaceInput';
import TitleInput from '../../components/walks/wirte/TitleInput';
import {
  useAddEveryWeekMoim,
  useAddOneDayMoim,
  usePostMoimImage,
} from '../../hooks/WriteQuery';
import {
  WalksMoim,
  WalksMoimEveryWeek,
  WalksMoimOneDay,
  WalksMoimType,
  WalksMoimTypes,
} from '../../models/WalksMoim';
import 'react-datepicker/dist/react-datepicker.css';
import UserState from '../../states/UserState';
import { Theme } from '../../styles/Theme';

export default function Write() {
  const router = useRouter();

  const [moimImages, setMoimImages] = useState<File[]>([]);
  const [user] = useRecoilState(UserState);

  const methods = useForm<WalksMoim>({
    mode: 'onChange',
    defaultValues: {
      type: 'everyWeek',
      personCount: 2,
    },
  });

  const { handleAddOneDayMoim } = useAddOneDayMoim();
  const { handleAddEveryWeekMoim } = useAddEveryWeekMoim();
  const { handlePostMoimImage } = usePostMoimImage();

  const {
    register,
    handleSubmit,
    control,
    setFocus,
    formState: { errors, isValid },
    resetField,
    setValue,
    watch,
  } = methods;

  const [moimType, setMoimType] = [
    watch('type'),
    (v: WalksMoimType) => setValue('type', v),
  ];

  const [pickPetsId, setPickPetsId] = useState('');

  const onSubmitOneDay = (data: WalksMoimOneDay) => {
    const {
      type,
      title,
      place,
      description,
      personCount,
      plannedDate,
      plannedTime,
    } = data;

    const oneDayMoim = {
      type,
      title,
      place,
      description,
      personCount,
      plannedDate,
      plannedTime,
      si: localStorage.getItem('currentAddress')?.split(' ')[0] || '',
      gu: localStorage.getItem('currentAddress')?.split(' ')[1] || '',
      dong: localStorage.getItem('currentAddress')?.split(' ')[2] || '',
      joinnedPetList: pickPetsId.slice(1, -1).split(',').map(Number),
    };

    return oneDayMoim;
  };

  const onSubmitEveryWeek = (data: WalksMoimEveryWeek) => {
    const {
      type,
      title,
      place,
      description,
      personCount,
      plannedDates,
      plannedTime,
    } = data;

    const everyWeekMoim = {
      type,
      title,
      place,
      description,
      personCount,
      plannedDates,
      plannedTime,
      si: window.localStorage.getItem('currentAddress')?.split(' ')[0] || '',
      gu: window.localStorage.getItem('currentAddress')?.split(' ')[1] || '',
      dong: window.localStorage.getItem('currentAddress')?.split(' ')[2] || '',
      joinnedPetList: pickPetsId.slice(1, -1).split(',').map(Number),
    };

    return everyWeekMoim;
  };

  const onSubmit = async (data: WalksMoim) => {
    try {
      if (data.type === WalksMoimTypes.????????????) {
        const moimImageResponse = await handlePostMoimImage(moimImages);
        const everyWeekMoimData = onSubmitEveryWeek(data);
        const moimResponse = await handleAddEveryWeekMoim(
          everyWeekMoimData,
          moimImageResponse
        );
        const communityId = await moimResponse.data.communityId;
        await router.push(`/walks/${communityId}`);
        localStorage.removeItem('pickPetsId');
      } else {
        const moimImageResponse = await handlePostMoimImage(moimImages);
        const oneDayMoimData = onSubmitOneDay(data);
        const moimResponse = await handleAddOneDayMoim(
          oneDayMoimData,
          moimImageResponse
        );
        const communityId = await moimResponse.data.communityId;
        await router.push(`/walks/${communityId}`);
        localStorage.removeItem('pickPetsId');
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user == null) {
      router.replace('/');
      return;
    }

    if (!window.localStorage.getItem('pickPetsId')) {
      alert('????????? ???????????????!');
      router.push('/walks');
      return;
    }
    setPickPetsId(localStorage.getItem('pickPetsId') || '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pickPetsId]);

  useEffect(() => {
    resetField('plannedDate');
    resetField('plannedDates');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moimType]);

  return (
    <>
      <TabTitle prefix="?????? ?????????" />
      <section css={moimFormContainer}>
        <h1
          css={css`
            margin-bottom: 20px;
          `}
        >
          ???? ?????? ?????? ?????????
        </h1>

        <FormProvider {...methods}>
          <form>
            <ImageUploadZone
              moimImages={moimImages}
              setMoimImages={setMoimImages}
            />
            <ul>
              <li>
                <label htmlFor="moim-name">????????? ????????? ???????????????.</label>
                <TitleInput
                  register={register}
                  errors={errors}
                  setFocus={setFocus}
                />
              </li>
              <li>
                <label htmlFor="moim-place">
                  ????????? ?????? ????????? ???????????????.
                </label>
                <PlaceInput register={register} errors={errors} />
              </li>
              <li>
                <label htmlFor="moim-description">
                  ?????? ????????? ?????? ??????????
                </label>
                <DescriptionInput register={register} errors={errors} />
              </li>
              <li>
                <label htmlFor="moim-personCount">????????? ???????????????</label>
                <PersonCountInput control={control} />
              </li>
              <li>
                <label htmlFor="moim-plan">?????? ????????? ???????????????.</label>
                <button
                  type="button"
                  className={
                    moimType === WalksMoimTypes.????????????
                      ? 'date-select-button active'
                      : 'date-select-button'
                  }
                  onClick={() => setMoimType(WalksMoimTypes.????????????)}
                >
                  ????????? ????????????
                </button>
                <button
                  type="button"
                  className={
                    moimType === WalksMoimTypes.????????????
                      ? 'date-select-button active'
                      : 'date-select-button'
                  }
                  onClick={() => setMoimType(WalksMoimTypes.????????????)}
                >
                  ????????? ????????????
                </button>
              </li>
              <li>
                {moimType === WalksMoimTypes.???????????? ? (
                  <EveryWeekPicker />
                ) : (
                  <OneDayPicker />
                )}
              </li>
              <li>
                <CommonButton
                  type="button"
                  onClick={handleSubmit(onSubmit)}
                  disabled={!isValid}
                >
                  ??????
                </CommonButton>
              </li>
            </ul>
          </form>
        </FormProvider>
      </section>
    </>
  );
}

const moimFormContainer = css`
  max-width: 800px;
  margin: 0 auto;
  padding: 35px;

  h1 {
    text-align: start;
    color: ${Theme.mainColor};
  }

  form ul li {
    margin-top: 20px;
  }

  form {
    width: 100%;
  }

  ul {
    list-style: none;
  }

  li {
    label {
      display: block;
      margin-bottom: 20px;
      font-weight: 600;
      font-size: 1.1rem;
    }
  }

  button.date-select-button {
    border: none;
    padding: 13px 16px;
    border-radius: 20px;
    background-color: ${Theme.disableBgColor};
    color: ${Theme.disableColor};
    font-size: 0.75rem;
    font-weight: 500;
    cursor: pointer;
  }

  button.date-select-button.active {
    background-color: ${Theme.mainColor};
    color: #fff;
  }

  button.date-select-button + button.date-select-button {
    margin-left: 10px;
  }
`;
