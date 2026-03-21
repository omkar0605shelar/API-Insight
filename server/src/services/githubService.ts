import axios from 'axios';

export class GithubService {
  async getUserRepos(accessToken: string): Promise<any[]> {
    try {
      const response = await axios.get('https://api.github.com/user/repos', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Accept': 'application/vnd.github.v3+json'
        },
        params: {
          sort: 'updated',
          per_page: 100
        }
      });

      return response.data.map((repo: any) => ({
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        html_url: repo.html_url,
        description: repo.description,
        language: repo.language,
        updated_at: repo.updated_at
      }));
    } catch (error: any) {
      console.error('GitHub API Error:', error.response?.data || error.message);
      throw new Error('Failed to fetch repositories from GitHub');
    }
  }

  async getRepoDetails(accessToken: string, fullName: string): Promise<any> {
    try {
      const response = await axios.get(`https://api.github.com/repos/${fullName}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      return response.data;
    } catch (error: any) {
      console.error('GitHub API Error:', error.response?.data || error.message);
      throw new Error('Failed to fetch repository details');
    }
  }
}
