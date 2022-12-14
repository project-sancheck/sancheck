package com.main026.walking.community.dto;

import com.main026.walking.comment.dto.CommentDto;
import com.main026.walking.community.entity.Community;
import com.main026.walking.member.dto.MemberDto;
import com.main026.walking.notice.dto.NoticeDto;
import com.main026.walking.pet.dto.PetDto;
import com.main026.walking.util.embedded.Address;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotEmpty;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class CommunityDto {

    @Getter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Post {
        @NotEmpty
        private String name;

        private List<String> imgUrls = new ArrayList<>();

        private String si;
        private String gu;
        private String dong;
        @NotEmpty
        private String place;
        @NotEmpty
        private String body;
        @Min(2)
        private Integer capacity;

        private Long[] joinnedPetList;

        //날짜로 받는 경우
        private String date;
        //요일로 받는 경우
        private String[] dates = null;

        private String time;

        private LocalDateTime createdAt = LocalDateTime.now();
    }

    @Getter
    @AllArgsConstructor
    @NoArgsConstructor
    public static class Patch {
        private String name;

        private String si;
        private String gu;
        private String dong;

        private String place;

        //날짜로 받는 경우
        private String date;
        //요일로 받는 경우
        private String[] dates;

        private List<String> images;

        private String time;

        private String body;
        private Integer capacity;
        private String imgUrl;
    }

    @Getter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class Response {
        private Long communityId;
        private String name;
        private Address address;
        private String place;
        private String body;
        private Integer capacity;

        private List<String> dayInfo;
        private String dateInfo;
        private String time;

        //private List<String> weeks;
        private MemberDto.compactResponse member;
        private List<String> imgUrls;
        private List<PetDto.compactResponse> communityPetList;
        private List<PetDto.compactResponse> sessionMemberPetList;
        private List<CommentDto.Response> comments;
        private NoticeDto.Response notices;
        private Integer participant;
        private LocalDateTime createdAt;
        private Long viewed;
        private Long liked;


        /**Todo 커뮤니티 응답데이터에 세션회원의 정보를 담는게 맞는가?
         * 응답에 로그인된 회원의 정보가 담기는게 맞을까?
         * 로그인하지 않은 상태에서도 null 값이지만 정보가 들어가는 불필요함이 생긴다.
         */

        public void setPetList(List<PetDto.compactResponse> petList){
            this.sessionMemberPetList = petList;
        }

        public void setImgUrls(List<String> imgUrls) {
            this.imgUrls = imgUrls;
        }
    }

    @Getter
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class compactResponse{
        private Long communityId;
        private String name;
        private String place;

        private String time;

        private String representImgUrls;


        public void setRepresentImgUrls(String representImgUrls) {
            this.representImgUrls = representImgUrls;
        }

        public compactResponse(Community community) {
            this.communityId = community.getId();
            this.name = community.getName();
            this.place = community.getPlace();
            this.time = community.getTime();
            //TODO 수정필요
            if(community.getImages().size()!=0) {
                this.representImgUrls = community.getImages().get(0).getStoreFilename();
            }else{
                this.representImgUrls = "DEFAULT_COMMUNITY_IMAGE.jpg";
            }
        }
    }
}