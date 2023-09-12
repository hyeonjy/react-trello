# Trello Clone
 카드, 보드를 사용하여 작업을 구성하는 투드리스트 보드입니다.

## 1. 사용 기술
<div style="display:flex">
  <img alt="React" src="https://img.shields.io/badge/React-61DAFB.svg?&style=for-the-badge&logo=React&logoColor=black"/>
  <img alt="Typescript" src="https://img.shields.io/badge/Typescript-3178C6?style=for-the-badge&logo=typescript&logoColor=black"/>
  <img alt="recoil" src="https://img.shields.io/badge/Recoil-3578E5?style=for-the-badge&logo=recoil&logoColor=black"/>
  <img alt="styledcomponents" src="https://img.shields.io/badge/styledcomponents-DB7093.svg?&style=for-the-badge&logo=styledcomponents&logoColor=black"/>
  <img alt="reactbeautifuldnd" src="https://img.shields.io/badge/React--beautiful--dnd-007396?style=for-the-badge&logo=reactbeautifuldnd&logoColor=white"/>

</div>

<br/>

✏️ 사용 라이브러리
- Styled-components : 컴포넌트 기반 스타일링
- Recoil : 다크모드, 보드 상태 관리
- React-beautiful-dnd : 드래그 앤 드롭 기능 구현

## 2. 구현기능
### 1. 보드 추가 및 삭제
- 상단 오른쪽 + 버튼을 통해 보드를 추가할 수 있습니다.
- 보드 이름의 오른쪽 x 버튼을 클릭하여 보드를 삭제할 수 있습니다. 
### 2. 리스트 추가, 수정 및 삭제
- 리스트 추가 시에는 작업이름, 분야, 세부사항을 등록할 수 있습니다.
- 리스트를 등록하면 작업이름이 추가되고, 작업이름을 클릭하면 분야와 세부사항을 확인할 수 있습니다.
- React Hook Form을 이용해 form을 구현 및 유효성을 검사합니다.
- 리스트의 오른쪽 버튼을 통해 수정과 삭제가 가능합니다.
- Recoil을 이용하여 데이터 상태를 관리합니다.
### 3. 리스트 드로그 앤 드롭
- 보드 내에서 작성한 리스트를 다른 보드로 드로그 앤 드롭이 가능합니다.
- 작성한 리스트를 휴지통에 드로그 앤 드롭하면 리스트가 삭제됩니다.
  
### 4. 다크모드/라이트모드 설정
- Recoil을 이용하여 다크모드/라이트모드 상태를 관리합니다.
- 새로고침 시 데이터가 초기화되는 상태를 방지하기 위해 Recoil-persist를 사용하여 데이터를 관리합니다.
