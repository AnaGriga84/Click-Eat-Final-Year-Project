import axios from 'axios';



class FileService {
    postImage(file) {
        var data = new FormData();
        data.append('file', file);

        var config = {
            method: 'post',
            url: '/api/fileupload',
            data: data
        };

        return axios(config);
    }
}


export default new FileService();