import './App.sass';
import { Button } from 'components/Button';
import { ReactComponent as DownloadIcon } from 'assets/icons/download.svg';
import { ReactComponent as USIcon } from 'assets/icons/US.svg';
import { ReactComponent as CheckCircleIcon } from 'assets/icons/check-circle.svg';
import { Input } from 'components/Input';
import { Dropdown } from 'components/Dropdown';
import { Avatar } from 'components/Avatar';
import { Badge } from 'components/Badge';
import { Toggle } from 'components/Toggle';
import { Progress } from 'components/Progress';
import { ProgressCircle } from 'components/ProgressCircle';
import { Slider } from 'components/Slider';
import { Tag } from 'components/Tag';
import { ButtonGroup } from 'components/ButtonGroup';
import { InputText } from 'components/InputText';
import { InputGroup } from 'components/InputGroup';
import { InputCode } from 'components/InputCode';
import { useState } from 'react';
import { useTheme } from 'helpers/ThemeProvider/lib/useTheme';
import { classNames } from 'helpers/classNames';
import { Checkbox } from 'components/Checkbox';
import { Modal } from 'components/Modal';
import { Pagination } from 'components/Pagination';
import { Breadcrumbs } from 'components/Breadcrumbs';
import { Table } from 'components/Table';
import { InputFile } from 'components/InputFile';
import { ProgressFile } from 'components/ProgressFile';
import { ReactComponent as PDFIcon } from 'assets/icons/PDF.svg';

function App() {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const openModal = () => {
    setOpen(true);
  }
  const closeModal = () => {
    setOpen(false);
  }
  const breadcrumbsItems = [
    { content: 'Settings', link: '#' },
    { content: 'Profile', link: '#' },
    { content: '...', link: '#' },
    { content: 'Team', link: '#' },
  ];
  const testRows = [
    {
      cells: [
        { content: "1" },
        { content: "Anna" },
        { content: "1997" },
        { content: "$100" }
      ]
    },
    {
      cells: [
        { content: "2" },
        { content: "Karl" },
        { content: "1975" },
        { content: "$1700" }
      ]
    },
    {
      cells: [
        { content: "3" },
        { content: "Ivan" },
        { content: "1925" },
        { content: "$200" }
      ]
    },
    {
      cells: [
        { content: "4" },
        { content: "Alex" },
        { content: "1978" },
        { content: "$3500" }
      ]
    },
    {
      cells: [
        { content: "5" },
        { content: "Mara" },
        { content: "1945" },
        { content: "$8300" }
      ]
    }
  ];
  return (
    <div className={classNames('app', {}, [theme])}>
      <div style={{ display: 'flex', position: 'fixed', zIndex: '99999999999' }}>
        <Toggle onClick={toggleTheme} />
      </div>


      <div className='wrapper'>

        <Button onClick={openModal}>Open modal</Button>

        <Modal isOpen={open} onClose={closeModal} iconColor='green' bgWrapper='circles'>
          <div style={{ fontSize: '18px', lineHeight: '28px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>Blog post published</div>
          <div style={{ fontSize: '14px', lineHeight: '20px', fontWeight: '400', color: 'var(--text-secondary)' }}>
            This blog post has been published. Team members will be able to edit this post and republish changes.
          </div>
          <div style={{ display: 'flex', marginTop: '32px', justifyContent: 'space-between' }}>
            <Button width='170px' size='L' theme='outline'>Cancel</Button>
            <Button width='170px' size='L'>Confirm</Button>
          </div>
        </Modal>
        <Modal isOpen={open} onClose={closeModal} iconColor='green' bgWrapper='circles'>
          <div style={{ fontSize: '18px', lineHeight: '28px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>Blog post published</div>
          <div style={{ fontSize: '14px', lineHeight: '20px', fontWeight: '400', color: 'var(--text-secondary)' }}>
            This blog post has been published. Team members will be able to edit this post and republish changes.
          </div>
          <div style={{ display: 'flex', marginTop: '32px', justifyContent: 'space-between' }}>
            <Button width='170px' size='L' theme='outline'>Cancel</Button>
            <Button width='170px' size='L'>Confirm</Button>
          </div>
        </Modal>

        {/* <div />
        <div />
        <div />
        <div />
        <div className='item-1-6' style={{ width: '600px' }}>
          <ProgressFile
            FileIcon={PDFIcon}
            fileName='Tech design requirements.pdf'
            fileSize='200 KB'
            value='10'
          />
        </div>
        <div className='item-1-6' style={{ width: '600px' }}>
          <ProgressFile
            FileIcon={PDFIcon}
            fileName='Tech design requirements.pdf'
            fileSize='200 KB'
            status='fulfilled'
          />
        </div>
        <div className='item-1-6' style={{ width: '600px' }}>
          <ProgressFile
            FileIcon={PDFIcon}
            fileName='Tech design requirements.pdf'
            fileSize='200 KB'
            status='rejected'
          />
        </div>
        <div className='item-1-6' style={{ width: '600px' }}>
          <InputFile />
        </div>
        <div className='item-1-6' style={{ width: '600px' }}>
          <InputFile disabled />
        </div>
        <div className='item-1-6'>
          <Table rows={testRows} />
        </div>
        <div className='item-1-6'>
          <Table rows={testRows} theme='interlaced-fill' />
        </div>
        <div className='item-1-6'>
          <div style={{ width: '800px' }}>
            <Breadcrumbs items={breadcrumbsItems} />
          </div>
        </div>
        <div className='item-1-6'>
          <div style={{ width: '800px' }}>
            <Breadcrumbs
              items={breadcrumbsItems}
              dividerTheme='slash'
            />
          </div>
        </div>
        <div className='item-1-6'>
          <div style={{ width: '800px' }}>
            <Breadcrumbs
              theme='line'
              items={breadcrumbsItems}
            />
          </div>
        </div>
        <div className='item-1-6'>
          <div style={{ width: '800px' }}>
            <Breadcrumbs
              theme='line'
              items={breadcrumbsItems}
              dividerTheme='slash'
            />
          </div>
        </div>
        <div className='item-1-6'>
          <div style={{ width: '800px' }}>
            <Breadcrumbs
              activeTheme='clear-color'
              theme='primary'
              items={breadcrumbsItems}
            />
          </div>
        </div>
        <div className='item-1-6'>
          <div style={{ width: '800px' }}>
            <Breadcrumbs
              activeTheme='clear'
              theme='primary'
              items={breadcrumbsItems}
              dividerTheme='slash'
            />
          </div>
        </div>

        <div className='item-1-6'>
          <div style={{ width: '800px' }}>
            <Pagination />
          </div>
        </div>
        <div className='item-1-6'>
          <div style={{ width: '800px' }}>
            <Pagination theme='default-circle' />
          </div>
        </div>
        <div className='item-1-6'>
          <div style={{ width: '800px' }}>
            <Pagination theme='minimal' />
          </div>
        </div>
        <div className='item-1-6'>
          <div style={{ width: '800px' }}>
            <Pagination theme='minimal-circle' />
          </div>
        </div>
        <div className='item-1-6'>
          <div style={{ width: '800px' }}>
            <Pagination theme='button-group' />
          </div>
        </div>
        <div className='item-1-6'>
          <div style={{ width: '600px' }}>
            <Pagination theme='text' />
          </div>
        </div>
        <div className='item-1-6'>
          <div style={{ width: '400px' }}>
            <Pagination theme='text-arrow' />
          </div>
        </div> */}

        {/* <div className='item-1-6'>
          <div className='col-3'>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button size='XS'>Label</Button>
              <Button size='S'>Label</Button>
              <Button size='M'>Label</Button>
              <Button size='L'>Label</Button>
              <Button size='XL'>Label</Button>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button theme='outline' size='XS'>Label</Button>
              <Button theme='outline' size='S'>Label</Button>
              <Button theme='outline' size='M'>Label</Button>
              <Button theme='outline' size='L'>Label</Button>
              <Button theme='outline' size='XL'>Label</Button>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button theme='color-outline' size='XS'>Label</Button>
              <Button theme='color-outline' size='S'>Label</Button>
              <Button theme='color-outline' size='M'>Label</Button>
              <Button theme='color-outline' size='L'>Label</Button>
              <Button theme='color-outline' size='XL'>Label</Button>
            </div>
          </div>
        </div>
        <div className='item-1-6'>
          <div className='col-2'>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button theme='color-clear' size='XS'>Label</Button>
              <Button theme='color-clear' size='S'>Label</Button>
              <Button theme='color-clear' size='M'>Label</Button>
              <Button theme='color-clear' size='L'>Label</Button>
              <Button theme='color-clear' size='XL'>Label</Button>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Button theme='clear' size='XS'>Label</Button>
              <Button theme='clear' size='S'>Label</Button>
              <Button theme='clear' size='M'>Label</Button>
              <Button theme='clear' size='L'>Label</Button>
              <Button theme='clear' size='XL'>Label</Button>
            </div>
          </div>
        </div> */}



        {/* <div style={{ display: 'flex', gap: '10px' }}>
          <Button>
            <DownloadIcon />
            Label
          </Button>
          <Button disabled>
            <DownloadIcon />
            Label
          </Button>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button theme='outline'>
            <DownloadIcon />
            Label
          </Button>
          <Button disabled theme='outline'>
            <DownloadIcon />
            Label
          </Button>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button theme='color-outline'>
            <DownloadIcon />
            Label
          </Button>
          <Button disabled theme='color-outline'>
            <DownloadIcon />
            Label
          </Button>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button theme='color-clear'>
            <DownloadIcon />
            Label
          </Button>
          <Button disabled theme='color-clear'>
            <DownloadIcon />
            Label
          </Button>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <Button theme='clear'>
            <DownloadIcon />
            Label
          </Button>
          <Button disabled theme='clear'>
            <DownloadIcon />
            Label
          </Button>
        </div>



        <ButtonGroup>
          <Button theme='primary'>Label</Button>
          <Button theme='primary'>Label</Button>
          <Button theme='primary'>Label</Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button theme='outline'>Label</Button>
          <Button theme='outline'>Label</Button>
          <Button theme='outline'>Label</Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button theme='color-outline'>1</Button>
          <Button theme='color-outline'>2</Button>
          <Button theme='color-outline'>3</Button>
          <Button theme='color-outline'>4</Button>
          <Button theme='color-outline'>5</Button>
          <Button theme='color-outline'>6</Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button>Primary</Button>
          <Button theme='outline'>Outline</Button>
          <Button theme='color-outline'>Color-outline</Button>
        </ButtonGroup>
        <div />
        <div className='item-1-6'>
          <div className='row-3'>
            <Slider
              text='tooltip-top'
              label="Opacity"
              formatOptions={{ style: 'percent' }}
              maxValue={500}
              type='range'
              defaultValue={[100, 350]}
              step={1}
            />
            <Slider
              text='bottom'
              label="Opacity"
              formatOptions={{ style: 'percent' }}
              maxValue={500}
              type='range'
              defaultValue={[100, 350]}
              step={1}
            />
            <Slider
              text='bottom'
              label="Opacity"
              formatOptions={{ style: 'percent' }}
              maxValue={500}
              type='single'
              defaultValue={100}
              step={1}
            />
            <Slider
              text='none'
              label="Opacity"
              formatOptions={{ style: 'percent' }}
              maxValue={500}
              type='single'
              defaultValue={100}
              step={1}
            />
          </div>
        </div>
        <div className='item-1-6'>
          <div className='col-2'>
            <div style={{ display: 'flex', gap: '20px' }}>
              <Avatar
                status='online'
                size='XS'
                src='https://avatars.dzeninfra.ru/get-zen_doc/1863639/pub_5e9448a5539dae4595bd8de7_5e983d88a9c5474bc701b44e/scale_1200'
              />
              <Avatar
                status='online'
                size='S'
                src='https://avatars.dzeninfra.ru/get-zen_doc/1863639/pub_5e9448a5539dae4595bd8de7_5e983d88a9c5474bc701b44e/scale_1200'
              />
              <Avatar
                status='online'
                size='M'
                src='https://avatars.dzeninfra.ru/get-zen_doc/1863639/pub_5e9448a5539dae4595bd8de7_5e983d88a9c5474bc701b44e/scale_1200'
              />
              <Avatar
                status='offline'
                size='L'
                src='https://avatars.dzeninfra.ru/get-zen_doc/1863639/pub_5e9448a5539dae4595bd8de7_5e983d88a9c5474bc701b44e/scale_1200'
              />
              <Avatar
                status='brb'
                size='XL'
                src='https://avatars.dzeninfra.ru/get-zen_doc/1863639/pub_5e9448a5539dae4595bd8de7_5e983d88a9c5474bc701b44e/scale_1200'
              />
              <Avatar
                status='dnd'
                size='2XL'
                src='https://avatars.dzeninfra.ru/get-zen_doc/1863639/pub_5e9448a5539dae4595bd8de7_5e983d88a9c5474bc701b44e/scale_1200'
              />
            </div>
            <div style={{ display: 'flex', gap: '20px' }}>
              <Avatar
                status='online'
                size='XS'
              />
              <Avatar
                status='online'
                size='S'
              />
              <Avatar
                status='online'
                size='M'
              />
              <Avatar
                status='offline'
                size='L'
              />
              <Avatar
                status='brb'
                size='XL'
              />
              <Avatar
                status='dnd'
                size='2XL'
              />
            </div>
          </div>
        </div> */}


        {/* <div className='item-1-6'>
          <Dropdown button={<Button theme='outline'>Open</Button>} items={[
            [{
              content: 'View profile',
              link: '/1',
              Icon: DownloadIcon
            },
            {
              content: 'Settings',
              link: '/2',
              Icon: DownloadIcon
            },
            {
              content: 'Keyboard shortcuts',
              link: '/3',
              disabled: true,
              Icon: DownloadIcon,

            }],
            [{
              content: 'View profile',
              link: '/1',
              Icon: DownloadIcon
            },
            {
              content: 'Settings',
              link: '/2',
              Icon: DownloadIcon
            },
            {
              content: 'Keyboard shortcuts',
              link: '/3',
              Icon: DownloadIcon
            }],
            [{
              content: 'Log out',
              link: '/3',
              Icon: DownloadIcon
            }]
          ]}
            header={
              (<div style={{ display: 'flex', padding: '12px 16px', position: 'relative' }}>
                <Avatar
                  status='dnd'
                  size='M'
                  src='https://avatars.dzeninfra.ru/get-zen_doc/1863639/pub_5e9448a5539dae4595bd8de7_5e983d88a9c5474bc701b44e/scale_1200'
                />
                <div style={{ marginLeft: '12px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', lineHeight: '20px', color: '#344054' }}>Olivia Rhye</div>
                  <div style={{ fontSize: '14px', fontWeight: '400', lineHeight: '20px', color: '#475467' }}>olivia@unitedui.com</div>
                </div>
              </div>)
            }
          />
        </div>


        <div className='item-1-6'>
          <div className='col-2'>
            <InputGroup group={false} label='Secure code' descr='This is a hint text to help user.' >
              <InputCode />
            </InputGroup>
            <InputGroup group={false} label='Secure code' descr='This is a hint text to help user.' >
              <InputCode type='3+3' />
            </InputGroup>
          </div>
          <div className='col-2'>
            <InputGroup group={false} label='Secure code' descr='This is a hint text to help user.' >
              <InputCode size='M' />
            </InputGroup>
            <InputGroup group={false} label='Secure code' descr='This is a hint text to help user.' >
              <InputCode size='M' type='3+3' />
            </InputGroup>
          </div>
          <div className='col-2'>
            <InputGroup group={false} label='Secure code' descr='This is a hint text to help user.' >
              <InputCode size='L' />
            </InputGroup>
            <InputGroup group={false} label='Secure code' descr='This is a hint text to help user.' >
              <InputCode size='L' type='3+3' />
            </InputGroup>
          </div>
        </div>

        <div className='item-1-6'>
          <div className='col-4'>
            <Input placeholder='Enter a description...' />
            <Input Icon={DownloadIcon} placeholder='Enter a description...' />
            <Input Icon={DownloadIcon} placeholder='Enter a description...' error='This is an error message.' />
            <Input disabled placeholder='Enter a description...' />
          </div>
          <div className='col-4'>
            <InputGroup label='Website' descr='This is a hint text to help user.'>
              <Input descr='This is a hint text to help user.' placeholder='Enter a description...' />
            </InputGroup>
            <InputGroup label='Website' descr='This is a hint text to help user.'>
              <Input Icon={DownloadIcon} descr='This is a hint text to help user.' placeholder='Enter a description...' />
            </InputGroup>
            <InputGroup label='Website' descr='This is a hint text to help user.' error='This is an error message.'>
              <Input Icon={DownloadIcon} descr='This is a hint text to help user.' placeholder='Enter a description...' error='This is an error message.' />
            </InputGroup>
            <InputGroup label='Website' descr='This is a hint text to help user.'>
              <Input disabled Icon={DownloadIcon} descr='This is a hint text to help user.' placeholder='Enter a description...' />
            </InputGroup>
          </div>
          <div className='col-4'>
            <InputGroup label='Website' descr='This is a hint text to help user.'>
              <InputText>https://</InputText>
              <Input descr='This is a hint text to help user.' placeholder='Enter a description...' />
            </InputGroup>
            <InputGroup label='Website' descr='This is a hint text to help user.'>
              <InputText>https://</InputText>
              <Input Icon={DownloadIcon} descr='This is a hint text to help user.' placeholder='Enter a description...' />
            </InputGroup>
            <InputGroup label='Website' descr='This is a hint text to help user.' error='This is an error message.'>
              <InputText>https://</InputText>
              <Input Icon={DownloadIcon} descr='This is a hint text to help user.' placeholder='Enter a description...' error='This is an error message.' />
            </InputGroup>
            <InputGroup label='Website' descr='This is a hint text to help user.'>
              <InputText>https://</InputText>
              <Input disabled Icon={DownloadIcon} descr='This is a hint text to help user.' placeholder='Enter a description...' />
            </InputGroup>
          </div>
          <div className='col-4'>
            <InputGroup label='Website' descr='This is a hint text to help user.'>
              <Input descr='This is a hint text to help user.' placeholder='Enter a description...' />
              <Button theme='outline'>
                <DownloadIcon />
                Copy
              </Button>
            </InputGroup>
            <InputGroup label='Website' descr='This is a hint text to help user.'>
              <Input Icon={DownloadIcon} descr='This is a hint text to help user.' placeholder='Enter a description...' />
              <Button theme='outline'>
                <DownloadIcon />
                Copy
              </Button>
            </InputGroup>
            <InputGroup label='Website' descr='This is a hint text to help user.' error='This is an error message.'>
              <Input Icon={DownloadIcon} descr='This is a hint text to help user.' placeholder='Enter a description...' error='This is an error message.' />
              <Button theme='outline'>
                <DownloadIcon />
                Copy
              </Button>
            </InputGroup>
            <InputGroup label='Website' descr='This is a hint text to help user.'>
              <Input disabled Icon={DownloadIcon} descr='This is a hint text to help user.' placeholder='Enter a description...' />
              <Button disabled theme='outline'>
                <DownloadIcon />
                Copy
              </Button>
            </InputGroup>
          </div>
          <div className='col-3'>
            <InputGroup label='Website' descr='This is a hint text to help user.' error='This is an error message.'>
              <Input Icon={DownloadIcon} descr='This is a hint text to help user.' error='This is an error message.' placeholder='olivia' />
              <InputText>@</InputText>
              <Input Icon={DownloadIcon} descr='This is a hint text to help user.' error='This is an error message.' placeholder='unitedui.com' />
              <Button theme='outline'>
                <DownloadIcon />
                Copy
              </Button>
            </InputGroup>
          </div>
          <div className='col-4'>
            <Input area placeholder='Enter a description...' />
            <Input disabled area placeholder='Enter a description...' />
            <InputGroup label='Website' descr='This is a hint text to help user.'>
              <Input area descr='This is a hint text to help user.' placeholder='Enter a description...' />
            </InputGroup>
            <InputGroup label='Website' descr='This is a hint text to help user.' error='This is an error message.'>
              <Input area descr='This is a hint text to help user.' placeholder='Enter a description...' error='This is an error message.' />
            </InputGroup>
          </div>
        </div>


        <div className='item-1-6'>
          <div className='col-2'>
            <div className='col-2'>
              <Toggle />
              <Toggle size='L' />
              <Toggle checked />
              <Toggle checked size='L' />
            </div>
            <div className='col-2'>
              <Toggle disabled />
              <Toggle disabled size='L' />
              <Toggle disabled checked />
              <Toggle disabled checked size='L' />
            </div>
          </div>
        </div> */}

        {/* <Tooltip />
      <RTooltip anchorSelect=".my-anchor-element">
        100%
      </RTooltip> */}

        {/* <Progress value='70' text='tooltip-top' />
        <Progress value='70' text='tooltip-bottom' />
        <Progress value='70' text='bottom-end' />
        <Progress value='70' text='end' />
        <div />

        <ProgressCircle value='50' size='XXS' title='Active users' />
        <ProgressCircle value='50' size='M' title='Active users' />
        <ProgressCircle value='50' size='L' title='Active users' />
        <ProgressCircle value='50' size='XL' title='Active users' />
        <ProgressCircle value='50' size='2XL' title='Active users' />

        <ProgressCircle half value='50' size='XXS' title='Active users' />
        <ProgressCircle half value='50' size='M' title='Active users' />
        <ProgressCircle half value='50' size='L' title='Active users' />
        <ProgressCircle half value='50' size='XL' title='Active users' />
        <ProgressCircle half value='50' size='2XL' title='Active users' />







        <div className='item-1-6'>
          <div style={{ display: 'flex', gap: '20px' }}>
            <Checkbox size='S' />
            <Checkbox checked size='S' />
            <Checkbox disabled size='S' />
            <Checkbox disabled checked size='S' />
            <div style={{ width: '20px' }} />
            <Checkbox size='M' />
            <Checkbox checked size='M' />
            <Checkbox disabled size='M' />
            <Checkbox disabled checked size='M' />
            <div style={{ width: '20px' }} />
            <Checkbox size='L' />
            <Checkbox checked size='L' />
            <Checkbox disabled size='L' />
            <Checkbox disabled checked size='L' />
            <div style={{ width: '20px' }} />
            <Checkbox size='XL' />
            <Checkbox checked size='XL' />
            <Checkbox disabled size='XL' />
            <Checkbox disabled checked size='XL' />
          </div>

        </div>





        <div className='item-1-6'>
          <div className='row-3-ai-start'>
            <div className='col-3'>
              <Tag>Label</Tag>
              <Tag size='M'>Label</Tag>
              <Tag size='L'>Label</Tag>
              <Tag onRemove={() => { }}>Label</Tag>
              <Tag size='M' onRemove={() => { }}>Label</Tag>
              <Tag size='L' onRemove={() => { }}>Label</Tag>
              <Tag counter='5'>Label</Tag>
              <Tag size='M' counter='5'>Label</Tag>
              <Tag size='L' counter='5'>Label</Tag>

              <Tag checkbox checked>Label</Tag>
              <Tag checkbox size='M'>Label</Tag>
              <Tag checkbox size='L'>Label</Tag>
              <Tag checkbox onRemove={() => { }}>Label</Tag>
              <Tag checkbox checked size='M' onRemove={() => { }}>Label</Tag>
              <Tag checkbox size='L' onRemove={() => { }}>Label</Tag>
              <Tag checkbox counter='5'>Label</Tag>
              <Tag checkbox size='M' counter='5'>Label</Tag>
              <Tag checkbox checked size='L' counter='5'>Label</Tag>
            </div>
            <div className='col-3'>
              <Tag Icon={USIcon}>Label</Tag>
              <Tag Icon={USIcon} size='M'>Label</Tag>
              <Tag Icon={USIcon} size='L'>Label</Tag>
              <Tag Icon={USIcon} onRemove={() => { }}>Label</Tag>
              <Tag Icon={USIcon} size='M' onRemove={() => { }}>Label</Tag>
              <Tag Icon={USIcon} size='L' onRemove={() => { }}>Label</Tag>
              <Tag Icon={USIcon} counter='5'>Label</Tag>
              <Tag Icon={USIcon} size='M' counter='5'>Label</Tag>
              <Tag Icon={USIcon} size='L' counter='5'>Label</Tag>

              <Tag checkbox Icon={USIcon}>Label</Tag>
              <Tag checkbox Icon={USIcon} size='M'>Label</Tag>
              <Tag checkbox Icon={USIcon} size='L'>Label</Tag>
              <Tag checkbox Icon={USIcon} onRemove={() => { }}>Label</Tag>
              <Tag checkbox Icon={USIcon} size='M' onRemove={() => { }}>Label</Tag>
              <Tag checkbox Icon={USIcon} size='L' onRemove={() => { }}>Label</Tag>
              <Tag checkbox Icon={USIcon} counter='5'>Label</Tag>
              <Tag checkbox Icon={USIcon} size='M' counter='5'>Label</Tag>
              <Tag checkbox Icon={USIcon} size='L' counter='5'>Label</Tag>
            </div>
            <div className='col-3'>
              <Tag dot>Label</Tag>
              <Tag dot size='M'>Label</Tag>
              <Tag dot size='L'>Label</Tag>
              <Tag dot onRemove={() => { }}>Label</Tag>
              <Tag dot size='M' onRemove={() => { }}>Label</Tag>
              <Tag dot size='L' onRemove={() => { }}>Label</Tag>
              <Tag dot counter='5'>Label</Tag>
              <Tag dot size='M' counter='5'>Label</Tag>
              <Tag dot size='L' counter='5'>Label</Tag>

              <Tag checkbox dot>Label</Tag>
              <Tag checkbox dot size='M'>Label</Tag>
              <Tag checkbox dot size='L'>Label</Tag>
              <Tag checkbox dot onRemove={() => { }}>Label</Tag>
              <Tag checkbox dot size='M' onRemove={() => { }}>Label</Tag>
              <Tag checkbox dot size='L' onRemove={() => { }}>Label</Tag>
              <Tag checkbox dot counter='5'>Label</Tag>
              <Tag checkbox dot size='M' counter='5'>Label</Tag>
              <Tag checkbox dot size='L' counter='5'>Label</Tag>
            </div>
          </div>
        </div>

        <div className='item-1-6'>
          <div className='col-4'>
            <div className='col-3'>
              <Badge color='gray' size='S' theme='primary'>Label</Badge>
              <Badge color='gray' size='M' theme='primary'>Label</Badge>
              <Badge color='gray' size='L' theme='primary'>Label</Badge>
              <Badge color='brand' size='S' theme='primary'>Label</Badge>
              <Badge color='brand' size='M' theme='primary'>Label</Badge>
              <Badge color='brand' size='L' theme='primary'>Label</Badge>
              <Badge color='error' size='S' theme='primary'>Label</Badge>
              <Badge color='error' size='M' theme='primary'>Label</Badge>
              <Badge color='error' size='L' theme='primary'>Label</Badge>
              <Badge color='warning' size='S' theme='primary'>Label</Badge>
              <Badge color='warning' size='M' theme='primary'>Label</Badge>
              <Badge color='warning' size='L' theme='primary'>Label</Badge>
              <Badge color='success' size='S' theme='primary'>Label</Badge>
              <Badge color='success' size='M' theme='primary'>Label</Badge>
              <Badge color='success' size='L' theme='primary'>Label</Badge>
              <Badge color='gray-blue' size='S' theme='primary'>Label</Badge>
              <Badge color='gray-blue' size='M' theme='primary'>Label</Badge>
              <Badge color='gray-blue' size='L' theme='primary'>Label</Badge>
              <Badge color='blue-light' size='S' theme='primary'>Label</Badge>
              <Badge color='blue-light' size='M' theme='primary'>Label</Badge>
              <Badge color='blue-light' size='L' theme='primary'>Label</Badge>
              <Badge color='blue' size='S' theme='primary'>Label</Badge>
              <Badge color='blue' size='M' theme='primary'>Label</Badge>
              <Badge color='blue' size='L' theme='primary'>Label</Badge>
              <Badge color='indigo' size='S' theme='primary'>Label</Badge>
              <Badge color='indigo' size='M' theme='primary'>Label</Badge>
              <Badge color='indigo' size='L' theme='primary'>Label</Badge>
              <Badge color='purple' size='S' theme='primary'>Label</Badge>
              <Badge color='purple' size='M' theme='primary'>Label</Badge>
              <Badge color='purple' size='L' theme='primary'>Label</Badge>
              <Badge color='pink' size='S' theme='primary'>Label</Badge>
              <Badge color='pink' size='M' theme='primary'>Label</Badge>
              <Badge color='pink' size='L' theme='primary'>Label</Badge>
              <Badge color='orange' size='S' theme='primary'>Label</Badge>
              <Badge color='orange' size='M' theme='primary'>Label</Badge>
              <Badge color='orange' size='L' theme='primary'>Label</Badge>
            </div>
            <div className='col-3'>
              <Badge dot color='gray' size='S' theme='primary'>Label</Badge>
              <Badge dot color='gray' size='M' theme='primary'>Label</Badge>
              <Badge dot color='gray' size='L' theme='primary'>Label</Badge>
              <Badge dot color='brand' size='S' theme='primary'>Label</Badge>
              <Badge dot color='brand' size='M' theme='primary'>Label</Badge>
              <Badge dot color='brand' size='L' theme='primary'>Label</Badge>
              <Badge dot color='error' size='S' theme='primary'>Label</Badge>
              <Badge dot color='error' size='M' theme='primary'>Label</Badge>
              <Badge dot color='error' size='L' theme='primary'>Label</Badge>
              <Badge dot color='warning' size='S' theme='primary'>Label</Badge>
              <Badge dot color='warning' size='M' theme='primary'>Label</Badge>
              <Badge dot color='warning' size='L' theme='primary'>Label</Badge>
              <Badge dot color='success' size='S' theme='primary'>Label</Badge>
              <Badge dot color='success' size='M' theme='primary'>Label</Badge>
              <Badge dot color='success' size='L' theme='primary'>Label</Badge>
              <Badge dot color='gray-blue' size='S' theme='primary'>Label</Badge>
              <Badge dot color='gray-blue' size='M' theme='primary'>Label</Badge>
              <Badge dot color='gray-blue' size='L' theme='primary'>Label</Badge>
              <Badge dot color='blue-light' size='S' theme='primary'>Label</Badge>
              <Badge dot color='blue-light' size='M' theme='primary'>Label</Badge>
              <Badge dot color='blue-light' size='L' theme='primary'>Label</Badge>
              <Badge dot color='blue' size='S' theme='primary'>Label</Badge>
              <Badge dot color='blue' size='M' theme='primary'>Label</Badge>
              <Badge dot color='blue' size='L' theme='primary'>Label</Badge>
              <Badge dot color='indigo' size='S' theme='primary'>Label</Badge>
              <Badge dot color='indigo' size='M' theme='primary'>Label</Badge>
              <Badge dot color='indigo' size='L' theme='primary'>Label</Badge>
              <Badge dot color='purple' size='S' theme='primary'>Label</Badge>
              <Badge dot color='purple' size='M' theme='primary'>Label</Badge>
              <Badge dot color='purple' size='L' theme='primary'>Label</Badge>
              <Badge dot color='pink' size='S' theme='primary'>Label</Badge>
              <Badge dot color='pink' size='M' theme='primary'>Label</Badge>
              <Badge dot color='pink' size='L' theme='primary'>Label</Badge>
              <Badge dot color='orange' size='S' theme='primary'>Label</Badge>
              <Badge dot color='orange' size='M' theme='primary'>Label</Badge>
              <Badge dot color='orange' size='L' theme='primary'>Label</Badge>
            </div>
            <div className='col-3'>
              <Badge color='gray' size='S' theme='outline'>Label</Badge>
              <Badge color='gray' size='M' theme='outline'>Label</Badge>
              <Badge color='gray' size='L' theme='outline'>Label</Badge>
              <Badge color='brand' size='S' theme='outline'>Label</Badge>
              <Badge color='brand' size='M' theme='outline'>Label</Badge>
              <Badge color='brand' size='L' theme='outline'>Label</Badge>
              <Badge color='error' size='S' theme='outline'>Label</Badge>
              <Badge color='error' size='M' theme='outline'>Label</Badge>
              <Badge color='error' size='L' theme='outline'>Label</Badge>
              <Badge color='warning' size='S' theme='outline'>Label</Badge>
              <Badge color='warning' size='M' theme='outline'>Label</Badge>
              <Badge color='warning' size='L' theme='outline'>Label</Badge>
              <Badge color='success' size='S' theme='outline'>Label</Badge>
              <Badge color='success' size='M' theme='outline'>Label</Badge>
              <Badge color='success' size='L' theme='outline'>Label</Badge>
              <Badge color='gray-blue' size='S' theme='outline'>Label</Badge>
              <Badge color='gray-blue' size='M' theme='outline'>Label</Badge>
              <Badge color='gray-blue' size='L' theme='outline'>Label</Badge>
              <Badge color='blue-light' size='S' theme='outline'>Label</Badge>
              <Badge color='blue-light' size='M' theme='outline'>Label</Badge>
              <Badge color='blue-light' size='L' theme='outline'>Label</Badge>
              <Badge color='blue' size='S' theme='outline'>Label</Badge>
              <Badge color='blue' size='M' theme='outline'>Label</Badge>
              <Badge color='blue' size='L' theme='outline'>Label</Badge>
              <Badge color='indigo' size='S' theme='outline'>Label</Badge>
              <Badge color='indigo' size='M' theme='outline'>Label</Badge>
              <Badge color='indigo' size='L' theme='outline'>Label</Badge>
              <Badge color='purple' size='S' theme='outline'>Label</Badge>
              <Badge color='purple' size='M' theme='outline'>Label</Badge>
              <Badge color='purple' size='L' theme='outline'>Label</Badge>
              <Badge color='pink' size='S' theme='outline'>Label</Badge>
              <Badge color='pink' size='M' theme='outline'>Label</Badge>
              <Badge color='pink' size='L' theme='outline'>Label</Badge>
              <Badge color='orange' size='S' theme='outline'>Label</Badge>
              <Badge color='orange' size='M' theme='outline'>Label</Badge>
              <Badge color='orange' size='L' theme='outline'>Label</Badge>
            </div>
            <div className='col-3'>
              <Badge dot color='gray' size='S' theme='outline'>Label</Badge>
              <Badge dot color='gray' size='M' theme='outline'>Label</Badge>
              <Badge dot color='gray' size='L' theme='outline'>Label</Badge>
              <Badge dot color='brand' size='S' theme='outline'>Label</Badge>
              <Badge dot color='brand' size='M' theme='outline'>Label</Badge>
              <Badge dot color='brand' size='L' theme='outline'>Label</Badge>
              <Badge dot color='error' size='S' theme='outline'>Label</Badge>
              <Badge dot color='error' size='M' theme='outline'>Label</Badge>
              <Badge dot color='error' size='L' theme='outline'>Label</Badge>
              <Badge dot color='warning' size='S' theme='outline'>Label</Badge>
              <Badge dot color='warning' size='M' theme='outline'>Label</Badge>
              <Badge dot color='warning' size='L' theme='outline'>Label</Badge>
              <Badge dot color='success' size='S' theme='outline'>Label</Badge>
              <Badge dot color='success' size='M' theme='outline'>Label</Badge>
              <Badge dot color='success' size='L' theme='outline'>Label</Badge>
              <Badge dot color='gray-blue' size='S' theme='outline'>Label</Badge>
              <Badge dot color='gray-blue' size='M' theme='outline'>Label</Badge>
              <Badge dot color='gray-blue' size='L' theme='outline'>Label</Badge>
              <Badge dot color='blue-light' size='S' theme='outline'>Label</Badge>
              <Badge dot color='blue-light' size='M' theme='outline'>Label</Badge>
              <Badge dot color='blue-light' size='L' theme='outline'>Label</Badge>
              <Badge dot color='blue' size='S' theme='outline'>Label</Badge>
              <Badge dot color='blue' size='M' theme='outline'>Label</Badge>
              <Badge dot color='blue' size='L' theme='outline'>Label</Badge>
              <Badge dot color='indigo' size='S' theme='outline'>Label</Badge>
              <Badge dot color='indigo' size='M' theme='outline'>Label</Badge>
              <Badge dot color='indigo' size='L' theme='outline'>Label</Badge>
              <Badge dot color='purple' size='S' theme='outline'>Label</Badge>
              <Badge dot color='purple' size='M' theme='outline'>Label</Badge>
              <Badge dot color='purple' size='L' theme='outline'>Label</Badge>
              <Badge dot color='pink' size='S' theme='outline'>Label</Badge>
              <Badge dot color='pink' size='M' theme='outline'>Label</Badge>
              <Badge dot color='pink' size='L' theme='outline'>Label</Badge>
              <Badge dot color='orange' size='S' theme='outline'>Label</Badge>
              <Badge dot color='orange' size='M' theme='outline'>Label</Badge>
              <Badge dot color='orange' size='L' theme='outline'>Label</Badge>
            </div>
            <div className='col-3'>
              <Badge color='gray' size='S' theme='rect'>Label</Badge>
              <Badge color='gray' size='M' theme='rect'>Label</Badge>
              <Badge color='gray' size='L' theme='rect'>Label</Badge>
              <Badge color='brand' size='S' theme='rect'>Label</Badge>
              <Badge color='brand' size='M' theme='rect'>Label</Badge>
              <Badge color='brand' size='L' theme='rect'>Label</Badge>
              <Badge color='error' size='S' theme='rect'>Label</Badge>
              <Badge color='error' size='M' theme='rect'>Label</Badge>
              <Badge color='error' size='L' theme='rect'>Label</Badge>
              <Badge color='warning' size='S' theme='rect'>Label</Badge>
              <Badge color='warning' size='M' theme='rect'>Label</Badge>
              <Badge color='warning' size='L' theme='rect'>Label</Badge>
              <Badge color='success' size='S' theme='rect'>Label</Badge>
              <Badge color='success' size='M' theme='rect'>Label</Badge>
              <Badge color='success' size='L' theme='rect'>Label</Badge>
              <Badge color='gray-blue' size='S' theme='rect'>Label</Badge>
              <Badge color='gray-blue' size='M' theme='rect'>Label</Badge>
              <Badge color='gray-blue' size='L' theme='rect'>Label</Badge>
              <Badge color='blue-light' size='S' theme='rect'>Label</Badge>
              <Badge color='blue-light' size='M' theme='rect'>Label</Badge>
              <Badge color='blue-light' size='L' theme='rect'>Label</Badge>
              <Badge color='blue' size='S' theme='rect'>Label</Badge>
              <Badge color='blue' size='M' theme='rect'>Label</Badge>
              <Badge color='blue' size='L' theme='rect'>Label</Badge>
              <Badge color='indigo' size='S' theme='rect'>Label</Badge>
              <Badge color='indigo' size='M' theme='rect'>Label</Badge>
              <Badge color='indigo' size='L' theme='rect'>Label</Badge>
              <Badge color='purple' size='S' theme='rect'>Label</Badge>
              <Badge color='purple' size='M' theme='rect'>Label</Badge>
              <Badge color='purple' size='L' theme='rect'>Label</Badge>
              <Badge color='pink' size='S' theme='rect'>Label</Badge>
              <Badge color='pink' size='M' theme='rect'>Label</Badge>
              <Badge color='pink' size='L' theme='rect'>Label</Badge>
              <Badge color='orange' size='S' theme='rect'>Label</Badge>
              <Badge color='orange' size='M' theme='rect'>Label</Badge>
              <Badge color='orange' size='L' theme='rect'>Label</Badge>
            </div>
            <div className='col-3'>
              <Badge dot color='gray' size='S' theme='rect'>Label</Badge>
              <Badge dot color='gray' size='M' theme='rect'>Label</Badge>
              <Badge dot color='gray' size='L' theme='rect'>Label</Badge>
              <Badge dot color='brand' size='S' theme='rect'>Label</Badge>
              <Badge dot color='brand' size='M' theme='rect'>Label</Badge>
              <Badge dot color='brand' size='L' theme='rect'>Label</Badge>
              <Badge dot color='error' size='S' theme='rect'>Label</Badge>
              <Badge dot color='error' size='M' theme='rect'>Label</Badge>
              <Badge dot color='error' size='L' theme='rect'>Label</Badge>
              <Badge dot color='warning' size='S' theme='rect'>Label</Badge>
              <Badge dot color='warning' size='M' theme='rect'>Label</Badge>
              <Badge dot color='warning' size='L' theme='rect'>Label</Badge>
              <Badge dot color='success' size='S' theme='rect'>Label</Badge>
              <Badge dot color='success' size='M' theme='rect'>Label</Badge>
              <Badge dot color='success' size='L' theme='rect'>Label</Badge>
              <Badge dot color='gray-blue' size='S' theme='rect'>Label</Badge>
              <Badge dot color='gray-blue' size='M' theme='rect'>Label</Badge>
              <Badge dot color='gray-blue' size='L' theme='rect'>Label</Badge>
              <Badge dot color='blue-light' size='S' theme='rect'>Label</Badge>
              <Badge dot color='blue-light' size='M' theme='rect'>Label</Badge>
              <Badge dot color='blue-light' size='L' theme='rect'>Label</Badge>
              <Badge dot color='blue' size='S' theme='rect'>Label</Badge>
              <Badge dot color='blue' size='M' theme='rect'>Label</Badge>
              <Badge dot color='blue' size='L' theme='rect'>Label</Badge>
              <Badge dot color='indigo' size='S' theme='rect'>Label</Badge>
              <Badge dot color='indigo' size='M' theme='rect'>Label</Badge>
              <Badge dot color='indigo' size='L' theme='rect'>Label</Badge>
              <Badge dot color='purple' size='S' theme='rect'>Label</Badge>
              <Badge dot color='purple' size='M' theme='rect'>Label</Badge>
              <Badge dot color='purple' size='L' theme='rect'>Label</Badge>
              <Badge dot color='pink' size='S' theme='rect'>Label</Badge>
              <Badge dot color='pink' size='M' theme='rect'>Label</Badge>
              <Badge dot color='pink' size='L' theme='rect'>Label</Badge>
              <Badge dot color='orange' size='S' theme='rect'>Label</Badge>
              <Badge dot color='orange' size='M' theme='rect'>Label</Badge>
              <Badge dot color='orange' size='L' theme='rect'>Label</Badge>
            </div>
            <div className='col-3'>
              <Badge color='gray' size='S' theme='modern'>Label</Badge>
              <Badge color='gray' size='M' theme='modern'>Label</Badge>
              <Badge color='gray' size='L' theme='modern'>Label</Badge>
              <Badge color='brand' size='S' theme='modern'>Label</Badge>
              <Badge color='brand' size='M' theme='modern'>Label</Badge>
              <Badge color='brand' size='L' theme='modern'>Label</Badge>
              <Badge color='error' size='S' theme='modern'>Label</Badge>
              <Badge color='error' size='M' theme='modern'>Label</Badge>
              <Badge color='error' size='L' theme='modern'>Label</Badge>
              <Badge color='warning' size='S' theme='modern'>Label</Badge>
              <Badge color='warning' size='M' theme='modern'>Label</Badge>
              <Badge color='warning' size='L' theme='modern'>Label</Badge>
              <Badge color='success' size='S' theme='modern'>Label</Badge>
              <Badge color='success' size='M' theme='modern'>Label</Badge>
              <Badge color='success' size='L' theme='modern'>Label</Badge>
              <Badge color='gray-blue' size='S' theme='modern'>Label</Badge>
              <Badge color='gray-blue' size='M' theme='modern'>Label</Badge>
              <Badge color='gray-blue' size='L' theme='modern'>Label</Badge>
              <Badge color='blue-light' size='S' theme='modern'>Label</Badge>
              <Badge color='blue-light' size='M' theme='modern'>Label</Badge>
              <Badge color='blue-light' size='L' theme='modern'>Label</Badge>
              <Badge color='blue' size='S' theme='modern'>Label</Badge>
              <Badge color='blue' size='M' theme='modern'>Label</Badge>
              <Badge color='blue' size='L' theme='modern'>Label</Badge>
              <Badge color='indigo' size='S' theme='modern'>Label</Badge>
              <Badge color='indigo' size='M' theme='modern'>Label</Badge>
              <Badge color='indigo' size='L' theme='modern'>Label</Badge>
              <Badge color='purple' size='S' theme='modern'>Label</Badge>
              <Badge color='purple' size='M' theme='modern'>Label</Badge>
              <Badge color='purple' size='L' theme='modern'>Label</Badge>
              <Badge color='pink' size='S' theme='modern'>Label</Badge>
              <Badge color='pink' size='M' theme='modern'>Label</Badge>
              <Badge color='pink' size='L' theme='modern'>Label</Badge>
              <Badge color='orange' size='S' theme='modern'>Label</Badge>
              <Badge color='orange' size='M' theme='modern'>Label</Badge>
              <Badge color='orange' size='L' theme='modern'>Label</Badge>
            </div>
            <div className='col-3'>
              <Badge dot color='gray' size='S' theme='modern'>Label</Badge>
              <Badge dot color='gray' size='M' theme='modern'>Label</Badge>
              <Badge dot color='gray' size='L' theme='modern'>Label</Badge>
              <Badge dot color='brand' size='S' theme='modern'>Label</Badge>
              <Badge dot color='brand' size='M' theme='modern'>Label</Badge>
              <Badge dot color='brand' size='L' theme='modern'>Label</Badge>
              <Badge dot color='error' size='S' theme='modern'>Label</Badge>
              <Badge dot color='error' size='M' theme='modern'>Label</Badge>
              <Badge dot color='error' size='L' theme='modern'>Label</Badge>
              <Badge dot color='warning' size='S' theme='modern'>Label</Badge>
              <Badge dot color='warning' size='M' theme='modern'>Label</Badge>
              <Badge dot color='warning' size='L' theme='modern'>Label</Badge>
              <Badge dot color='success' size='S' theme='modern'>Label</Badge>
              <Badge dot color='success' size='M' theme='modern'>Label</Badge>
              <Badge dot color='success' size='L' theme='modern'>Label</Badge>
              <Badge dot color='gray-blue' size='S' theme='modern'>Label</Badge>
              <Badge dot color='gray-blue' size='M' theme='modern'>Label</Badge>
              <Badge dot color='gray-blue' size='L' theme='modern'>Label</Badge>
              <Badge dot color='blue-light' size='S' theme='modern'>Label</Badge>
              <Badge dot color='blue-light' size='M' theme='modern'>Label</Badge>
              <Badge dot color='blue-light' size='L' theme='modern'>Label</Badge>
              <Badge dot color='blue' size='S' theme='modern'>Label</Badge>
              <Badge dot color='blue' size='M' theme='modern'>Label</Badge>
              <Badge dot color='blue' size='L' theme='modern'>Label</Badge>
              <Badge dot color='indigo' size='S' theme='modern'>Label</Badge>
              <Badge dot color='indigo' size='M' theme='modern'>Label</Badge>
              <Badge dot color='indigo' size='L' theme='modern'>Label</Badge>
              <Badge dot color='purple' size='S' theme='modern'>Label</Badge>
              <Badge dot color='purple' size='M' theme='modern'>Label</Badge>
              <Badge dot color='purple' size='L' theme='modern'>Label</Badge>
              <Badge dot color='pink' size='S' theme='modern'>Label</Badge>
              <Badge dot color='pink' size='M' theme='modern'>Label</Badge>
              <Badge dot color='pink' size='L' theme='modern'>Label</Badge>
              <Badge dot color='orange' size='S' theme='modern'>Label</Badge>
              <Badge dot color='orange' size='M' theme='modern'>Label</Badge>
              <Badge dot color='orange' size='L' theme='modern'>Label</Badge>
            </div>
          </div>
        </div> */}

      </div>
    </div>
  );
}

export default App;
