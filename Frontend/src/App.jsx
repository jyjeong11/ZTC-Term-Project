import { useState, useEffect, useRef } from 'react'
import './App.css'

import { fetchHealthCheck, fetchAnalyzeImage, fetchAnalyzeResult, fetchUploadImage } from './serivces/ImageServices.jsx'
import mainIcon from '../src/assets/icon.png'
// import { CheckIcon } from '@mui/icons-material';
import { Alert } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
function App() {
  const [imageUploadStatus, setImageUploadStatus] = useState(false);
  const [analyzeStatus, setAnalyzeStatus] = useState(false);
  const [ImageUploadedUrl, setImageUploadedUrl] = useState(null);
  const [resultImageUrl, setResultImageUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState(null);
  const [uploadError, setUploadError] = useState(null); // 에러 상태 추가
  const [isHealthy, setIsHealthy] = useState(null);
  const fileInputRef = useRef(null); 

  useEffect(() => {
    return () => {
      if (resultImageUrl) {
        URL.revokeObjectURL(resultImageUrl);
      }
    };
  }, [resultImageUrl]);

  const handleFileChange = (event) => {
      const file = event.target.files[0];
      
      if (file) {
          // 1. 파일 객체를 상태에 저장
          setSelectedFile(file);
          // 2. 파일이 선택되면 바로 업로드를 시작
          handleFileUpload(file);
      }
  };

  const openFileExplorer = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // 숨겨진 input을 클릭
    }
  };

  const handleFileUpload = (fileToUpload) => {
    setImageUploadStatus(false);
    setAnalyzeStatus(false);
    setUploadedFileName(null);
    setResultImageUrl(null);
    setUploadError(null);
    
    fetchUploadImage(fileToUpload).then(response => {
      if (response.status === 200) {
        return response.blob();
      } else {
        console.error("Failed to fetch analyze result image");
        setImageUploadedUrl(null); // 실패 시 URL 초기화
      }
    }).then(blob => {
      if (blob) {
        const imageUrl = URL.createObjectURL(blob);
        // 상태 업데이트: 이 업데이트가 위쪽 useEffect를 트리거합니다.
        setImageUploadedUrl(imageUrl);
        setImageUploadStatus(true);
        setUploadedFileName(fileToUpload.name);
      } else {
        setImageUploadStatus(false);
        setUploadError("업로드된 이미지의 블롭을 가져오지 못했습니다.");
      }
    })
    .catch(error => {
      console.error("Upload process error:", error);
      setUploadError(`업로드 실패: ${error.message}`);
      setImageUploadStatus(false);
    });
  };

  const analyzeImage = (filename) => {
    console.log("analyzing image");
    if (resultImageUrl) {
        URL.revokeObjectURL(resultImageUrl);
        setResultImageUrl(null); // 새 요청 시작 전 URL 초기화
    }
    
    fetchAnalyzeImage(filename).then(response => {
      if (response.status == 200) {
        setAnalyzeStatus(true);
      }
      return response.json();
    }).then(data => {
      console.log("analyze image response data:", data);
      
      const fileName = data.file_names && data.file_names.length > 0 ?  data.file_names[0] : 'image.jpg';

      if (fileName) {
        displayResultImage(fileName);
        console.log("Extracted file name:", fileName);
      }
    });
  }

  const displayResultImage = (data) => {
    // Implement displaying the analyze result
    console.log("Displaying analyze result:" , data);
    fetchAnalyzeResult(data).then(resultResponse => {
      if (resultResponse.status === 200) {
        return resultResponse.blob();
      } else {
        console.error("Failed to fetch analyze result image");
        setResultImageUrl(null); // 실패 시 URL 초기화
      }
    }).then(blob => {
      if (blob) {
        const imageUrl = URL.createObjectURL(blob);
        // 상태 업데이트: 이 업데이트가 위쪽 useEffect를 트리거합니다.
        setResultImageUrl(imageUrl);
      }
    });
  }

  const healthCheck = () => {
    console.log("performing health check");
    const response = fetchHealthCheck();
    fetchHealthCheck().then(res => {
      if (res) {
        setIsHealthy(true);

        const timer = setTimeout(() => {
          setIsHealthy(false);
        }, 3000); // 3초 후에 isHealthy를 false로 설정

        // Cleanup function to clear the timer if the component unmounts before the timeout
        return () => clearTimeout(timer);
      } else {
        setIsHealthy(false);
      }
    });
  }

  return (
    <>
      <img src={mainIcon} alt="Main Icon" style={{ width: '100px', height: '100px' }} />
      <h1>PII Detector</h1>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        style={{ display: 'none' }} 
        accept="image/*"
      />

      <div className="image-upload">
        <button 
          onClick={openFileExplorer}
          style={{ 
            backgroundColor: imageUploadStatus ? 'rgb(52, 211, 153)' : (selectedFile ? 'rgb(251, 191, 36)' : 'rgb(59, 130, 246)'),
            color: 'white',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            border: 'none',
            fontWeight: 'bold'
          }}
        > 
        {imageUploadStatus ? `✅ Uploaded: ${uploadedFileName}` : (selectedFile ? `⬆️ Uploading ${selectedFile.name}...` : 'Select & Upload Image')}
          </button>
          
          {/* 에러 메시지 표시 */}
          {uploadError && <p style={{color: 'red', marginTop: '10px'}}>Error: {uploadError}</p>}
      </div>

      <div className="image-display">
        {imageUploadStatus &&
          <>
          <h3>Image to be analyzed</h3>
          <div style={{ 
            display: 'flex',          /* Flexbox 활성화 */
            flexDirection: 'column',  /* 주축을 수직(세로)으로 설정 */
            alignItems: 'center'      /* 교차 축(수평)에서 가운데 정렬 */
          }}>
            <img src={ImageUploadedUrl} alt="To be analyzed" /> 
            <button onClick={() => { analyzeImage(uploadedFileName) }}> 
              analyze the image
            </button>
          </div>

          </>
        }
      </div>
      
      {analyzeStatus &&
        <div className="image-result">
          <h3>Analyzed Image</h3>
          <img src={resultImageUrl} alt="Analyzed" />
        </div> 
      }
      <div className="health-check" style={{ marginTop: '20px' }}>
        <button onClick={() => { healthCheck()}}> 
          health check
        </button>
        {isHealthy &&
          <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
            API Server is Healthy!
          </Alert>
        }
      </div>
    </>
  )
}

export default App
